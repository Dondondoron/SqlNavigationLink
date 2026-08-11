
from pathlib import Path
from typing import List
from sqlglot.errors import ParseError
from sqlglot import exp
from classes import SqlModelInfo, TableInfo
from collections import defaultdict

def parse_sql_models_and_extract_tables(models):
    # Dict to store tables found per model
    model_tables = {}
    for model_key, model_value in models.items():
        # Assuming model[1] contains the raw SQL string
        model_header = model_value[0]
        model_name = ''
        sql_statement = None
        if len(model_value) == 1:
            model_name = Path(model_key).name.replace('.sql', '')
            sql_statement =  model_value[0]
        elif len(model_value) > 1:
            
            sql_statement =  model_value[1]
            for expr in model_header.expressions:
                if expr.name == 'name':
                    model_name = str(expr.args['value'])
        
        if sql_statement is None:
            continue
        try:
            filename = Path(model_key).name
            sql_model = parseCTELess(
                model_name=model_name,
                filename=filename,
                file_path=model_key,
                query=sql_statement)
            model_tables[model_key] = sql_model
        except ParseError as e:
            print(f"Error parsing SQL for model {model_key}: {e}")
            model_tables[model_key] = []
    return model_tables



def parseSelectExpression(expr: exp.Expr, list_of_columns: set[str]):
    if isinstance(expr, exp.Column):
        list_of_columns.add(expr.sql())
    elif isinstance(expr, exp.Expr):
            for arg in expr.args.values():
                if arg is not None:
                    parseSelectExpression(arg, list_of_columns)
    elif isinstance(expr, list):
            for i in expr:
                parseSelectExpression(i, list_of_columns)
    return list_of_columns

def parseCTELess(model_name:str, filename:str, file_path:str, query: exp.Select):
    uncte_query = query.copy()
    uncte_query.set("with_", None)
    

    [tables, columns] = parseSelect(uncte_query)
    ctes : set[TableInfo] = set()
    cte_names = {cte.alias_or_name.lower() for cte in query.ctes} if hasattr(query, 'ctes') else []

    all_cte_columns = {}


    for cte in query.find_all(exp.CTE):
        [cte_tables, cte_columns] = parseSelect(cte)
        tables |= cte_tables  # Or: tables.update(cte_tables)
        all_cte_columns[cte.alias_or_name] = cte_columns
    for table in set(tables):
        ref_table_name = table.fullname
        if ref_table_name.replace('"' , '') in cte_names:
                        ctes.add(table)
                        tables.remove(table)

    return SqlModelInfo(name=model_name,
                         file_name=filename , 
                         file_path=file_path, 
                         table_names=tables, 
                         cte_names=ctes,
                         columns=columns,
                         cte_columns=all_cte_columns
                         )
def parseTableFields(query:exp.Select|exp.CTE):
     alias_to_table = {}
     for table in query.find_all(exp.Table):
         real_name = table.name
         # If the table has an alias, use it as the key; otherwise, use the table name itself
         prefix = table.alias if table.alias else real_name
         alias_to_table[prefix] = real_name
     
     table_fields = defaultdict(set)
     unprefixed_fields = set()
     for col in query.find_all(exp.Column):
                         col_name = col.name
                         col_prefix = col.table  # e.g., 'b' in 'b.branch_name'
     
                         if col_prefix:
                             real_table_name = alias_to_table.get(col_prefix, col_prefix)
                             table_fields[real_table_name].add(col_name)
                         else:
                             unprefixed_fields.add(col_name)
     return [table_fields, unprefixed_fields]

def parseSelect(query: exp.Select|exp.CTE):
     
            table_fields, unprefixed_fields = parseTableFields(query)
            
            all_tables = query.find_all(exp.Table)
            tables: set[TableInfo] = set()
            for table in all_tables:
                unaliased_table = table.copy()
                unaliased_table.set("alias", None)
                ref_table_name = unaliased_table.sql()
                if type(query) == exp.Select:
                    cte_names = {cte.alias_or_name.lower() for cte in query.ctes}
                    # Inside your tables loop:
                    if ref_table_name.lower() in cte_names:
                        continue 
                real_name = table.name
                prefix = real_name
                fields: frozenset[str]
                if(len(table_fields) == 0):
                    fields = frozenset(unprefixed_fields)
                else:
                    fields = frozenset(table_fields.get(prefix, set()))
                tables.add(
                    TableInfo(
                        fullname=ref_table_name,
                        name=table.name,
                        db=table.db,
                        catalog=table.catalog,
                        alias=table.alias,
                        fields=fields,
                    )
                )

            
            columns = makeColumns(query, tables)

            
            return [tables, columns]


def makeColumns(query: exp.Select|exp.CTE, tables: set[TableInfo]):
    columns = {}
    for expr in query.selects:
        sources = parseSelectExpression(expr, set())

        # Case 1: Single table query (auto-qualify with table full name)
        if len(tables) == 1:
            single_table = next(iter(tables))
            table_alias = single_table.fullname
            columns[expr.alias_or_name] = [
                f"{table_alias}.{src.split('.')[-1]}" for src in sources
            ]

        # Case 2: Multiple tables (match source table prefix against table definitions)
        else:
            updated_sources = []
            for source in sources:
                split_parts = source.split(".")

                # If qualified (e.g. "t1.col_name")
                if len(split_parts) == 2:
                    col_table_alias, col_name = split_parts[0], split_parts[1]
                    clean_alias = col_table_alias.replace('"', "")

                    actual_table = next(
                        (
                            t
                            for t in tables
                            if (t.alias and t.alias == clean_alias)
                            or t.name == col_table_alias
                            or t.fullname == col_table_alias
                        ),
                        None,
                    )

                    if actual_table:
                        updated_sources.append(f"{actual_table.fullname}.{col_name}")
                    else:
                        print(
                            f"⚠️ Warning: Could not find matching table for column source: {source}"
                        )
                        updated_sources.append(source)
                else:
                    updated_sources.append(source)

            columns[expr.alias_or_name] = updated_sources
    return columns