
from __future__ import annotations
from pathlib import Path
from typing import List, Optional, Dict, Any, Union
from sqlglot.errors import ParseError
from sqlglot import exp
from classes import SqlModelInfo, TableInfo
from collections import defaultdict
from dataclasses import dataclass
from pydantic import BaseModel
import json

@dataclass
class RawModel:
    name:str
    path:str
    file_name:str
    query:exp.Query

class ColRef(BaseModel):
    name: str
    table: str
    refs: List["ColRef"] = []

def parse_sql_models_and_extract_tables(models):
    # Dict to store tables found per model
    model_tables = {}

    raw_schema : dict[str, List[ColRef]] = {}

    raw_models: List[RawModel] = []
    for model_key, model_value in models.items():  
        model_header = model_value[0]
        model_name = ''
        sql_statement = None
        if len(model_value) == 1:
            model_name = Path(model_key).name.replace('.sql', '')
            sql_statement =  model_value[0]
        elif len(model_value) > 1:
            if type(model_value[0]).__name__ == 'Audit':
                 continue
            sql_statement =  model_value[1]
            for expr in model_header.expressions:
                if expr.name == 'name':
                    model_name = str(expr.args['value'])
        
        if sql_statement is None or not isinstance(sql_statement, exp.Query):
            continue

        filename = Path(model_key).name
        raw_schema[model_name] = [ColRef(name=sel, table=model_name) for sel in sql_statement.named_selects]
        raw_models.append(RawModel(model_name, model_key, filename, sql_statement))
         
    for model in raw_models:
        
        try:
            
            sql_model = parseModel(model, raw_schema)
            model_tables[model.path] = sql_model
        except ParseError as e:
            print(f"Error parsing SQL for model {model.path}: {e}")
            model_tables[model.path] = []
    return model_tables



def parseModel(model: RawModel, raw_schema: dict[str, List[ColRef]]):

    query = model.query

    uncte_query = query.copy()
    uncte_query.set("with_", None)

    table_column_map: dict[str, List[ColRef]] = dict()
    
    if model.name == 'reddit_trending_with_prices':
         print('')
         
    for cte in query.find_all(exp.CTE):

        for sq in cte.find_all(exp.Subquery):
             sub_refs = parseSelect(sq, table_column_map, raw_schema)
             table_column_map[sq.alias_or_name] = sub_refs
         
        cte_refs = parseSelect(cte, table_column_map, raw_schema)
        table_column_map[cte.alias_or_name] = cte_refs
    
 
    for cte in uncte_query.find_all(exp.Subquery):
         sub_refs = parseSelect(cte, table_column_map, raw_schema)
         table_column_map[cte.alias_or_name] = sub_refs
    
    cte_names = {cte.alias_or_name for cte in query.ctes} if hasattr(query, 'ctes') else []
    sq_aliases = {cte.alias_or_name for cte in query.find_all(exp.Subquery)}


    columns = parseSelect(uncte_query, table_column_map, raw_schema)

    table_names = set([table.name for table in query.find_all(exp.Table) if table.alias_or_name not in cte_names and table.name not in cte_names and table.alias_or_name not in sq_aliases])

    if str(table_column_map).find('*') >= 0:
         print('Found Star')

    if str(columns).find('*') >= 0:
         print('Found Star')

    return SqlModelInfo(name=model.name,
                         file_name=model.file_name , 
                         file_path=model.path,
                         columns=columns,
                         table_names=table_names
                         )


def parseColumn(column: exp.Column, table_map, all_table_map:dict[str, List[ColRef]], schema:dict[str, List[ColRef]]):
    if column.name == '*':
        exp_cols = expand_single_wildcard(column.table, table_map, all_table_map, schema)
        return exp_cols
    table_name = next(iter(table_map)) if len(table_map) == 1 else get_table_from_column(column, table_map, all_table_map, schema)
    if table_name in all_table_map:
        return [ColRef(name=column.alias_or_name, table=table_name, refs=all_table_map[table_name])]
    elif table_name in schema:
         return [ColRef(name=column.alias_or_name, table=table_name, refs=schema[table_name])]
    else:return [ColRef(name=column.alias_or_name, table=table_name)]

def parseSelect(query: exp.Query|exp.CTE|exp.Subquery, all_table_map:dict[str, List[ColRef]], schema:dict[str, List[ColRef]]):
            
            tables = list(query.find_all(exp.Table))

            table_map = {table.alias_or_name: table.name for table in tables}

            all_columns : List[ColRef] = []

            for expr in query.selects:
                columns: List[ColRef] = []
                if isinstance(expr, exp.Star):
                     exp_cols = expand_full_wildcard(expr, tables, all_table_map, schema)
                     all_columns.extend(exp_cols)
                     if len(exp_cols) == 0:
                          print('Failed')
                     continue

                if isinstance(expr, exp.Column):
                     all_columns.extend(parseColumn(expr, table_map, all_table_map, schema))
                     continue
                else:
                    for column in expr.find_all(exp.Column):
                        columns.extend(parseColumn(column, table_map, all_table_map, schema))

                if(expr.alias_or_name == '*'):
                     all_columns.extend(columns)
                else: all_columns.append(ColRef(name=expr.alias_or_name, table=query.alias_or_name, refs=columns))

            return all_columns

def expand_single_wildcard(table_name:str, table_map:dict, table_column_map:dict[str, List[ColRef]], schema:dict[str, List[ColRef]]):
    cols : List[ColRef] = []

    if table_name in table_map:
        table_name = table_map[table_name]


    if table_name in table_column_map:
        colrefs = table_column_map[table_name]
        cols.extend(colrefs)
    elif table_name in schema:
         columns = schema[table_name]
         for col in columns:  
            cols.append(ColRef(name=col.name, table=table_name))
    return cols

def expand_full_wildcard(expr:exp.Star, query_tables:List[exp.Table], table_column_map:dict[str, List[ColRef]], schema:dict[str, List[ColRef]]):
    cols : List[ColRef] = []
    for table in query_tables:
        table_name = table.name
        if table_name in table_column_map:
            colrefs = table_column_map[table_name]
            cols.extend(colrefs)
        elif table_name in schema:
             columns = schema[table_name]
             for col in columns:  
                cols.append(ColRef(name=col.name, table=table_name))
    return cols

def get_table_from_column(column: exp.Column, table_map: dict, all_table_map:dict[str, List[ColRef]], schema:dict[str, List[ColRef]]):
    table_name = column.table
    if table_name in table_map:
        return table_map[table_name]
    elif table_name in all_table_map:
         return table_name
    elif table_name in schema:
         return table_name
    else:
         print(f'Table {table_name} not found for Column {column.sql()}')
         return table_name
    
