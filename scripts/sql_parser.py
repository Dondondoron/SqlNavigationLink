
from __future__ import annotations
from pathlib import Path
from typing import List, Optional, Dict, Any, Union, Set, Iterable
from sqlglot.errors import ParseError
from sqlglot import exp
from classes import SqlModelInfo, TableInfo, ColRef, RawModel
import json
import logging
from graphlib import TopologicalSorter


def sort(raw_models: List[RawModel]):
    # 1. Map names to objects
    model_map = {m.name: m for m in raw_models}

    # 2. FAST DEPENDENCY LOOKUP (Runs in O(N) instead of O(N^2))
    # Build a lookup dictionary: table_name -> set of models that reference it
    referenced_by = {}
    for m in raw_models:
        for table_name in m.tables:
            if table_name not in referenced_by:
                referenced_by[table_name] = set()
            referenced_by[table_name].add(m.name)

    # 3. BUILD THE GRAPH (Independent models first)
    dependencies = {}
    for m in raw_models:
        # If other models reference this model's name in their tables,
        # those other models DEPEND on this model.
        # Therefore, this model must come BEFORE them.
        # TopologicalSorter expects: node -> set of its prerequisites.
        # So, the other models have 'm.name' as a prerequisite.

        # We initialize every model in the graph
        if m.name not in dependencies:
            dependencies[m.name] = set()

        # Find who depends on us, and mark us as their prerequisite
        dependent_models = referenced_by.get(m.name, set())
        for dep_model in dependent_models:
            if dep_model != m.name and dep_model in model_map:
                if dep_model not in dependencies:
                    dependencies[dep_model] = set()
                dependencies[dep_model].add(m.name)

    # 4. SORT AND REBUILD
    ts = TopologicalSorter(dependencies)
    sorted_names = list(ts.static_order())
    sorted_models = [model_map[name] for name in sorted_names]

    return sorted_models

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

        tables = set((table.name for table in sql_statement.find_all(exp.Table)))
        filename = Path(model_key).name
        raw_schema[model_name] = [ColRef(name=sel, table=model_name) for sel in sql_statement.named_selects]
        raw_models.append(RawModel(model_name, model_key, filename, sql_statement, tables))


    sorted_models = sort(raw_models)

    #all_referenced_tables = {table for m in raw_models for table in m.tables}
    #raw_models.sort(key=lambda x: 0 if x.name in all_referenced_tables else 1)
    
    for model in sorted_models:
        
        try:
            
            sql_model = parseModel(model, raw_schema)
            model_tables[model.path] = sql_model

            if model.name in raw_schema:
                schematic = raw_schema[model.name]
                if len(schematic) == 1:
                    raw_schema[model.name] = [ColRef(name=col.name, table=model.name) for col in sql_model.columns]
            
        except ParseError as e:
            print(f"Error parsing SQL for model {model.path}: {e}")
            model_tables[model.path] = []
    return model_tables


def parseModel(model: 'RawModel', raw_schema: Dict[str, List['ColRef']]):
    query = model.query
    
    uncte_query = query.copy()
    uncte_query.set("with_", None)

    if model.name == 'group_day_holding_with_bors':
        print('')

    table_column_map: Dict[str, List['ColRef']] = {}
    
    for cte in query.find_all(exp.CTE):
        for sq in cte.find_all(exp.Subquery):
            sub_refs = parseSelect(sq, table_column_map, raw_schema)
            table_column_map[sq.alias_or_name] = sub_refs
            
        cte_refs = parseSelect(cte, table_column_map, raw_schema)
        table_column_map[cte.alias_or_name] = cte_refs

    for sq in uncte_query.find_all(exp.Subquery):
        sub_refs = parseSelect(sq, table_column_map, raw_schema)
        table_column_map[sq.alias_or_name] = sub_refs

    cte_names: Set[str] = {cte.alias_or_name for cte in query.ctes} if hasattr(query, 'ctes') else set()
    sq_aliases: Set[str] = {sq.alias_or_name for sq in query.find_all(exp.Subquery)}

    columns = parseSelect(uncte_query, table_column_map, raw_schema)

    truncated_columns = truncateColumns(columns, model.name)

    table_names = {
        table.name for table in query.find_all(exp.Table) 
        if table.alias_or_name not in cte_names 
        and table.name not in cte_names 
        and table.alias_or_name not in sq_aliases
    }

    if '*' in str(table_column_map) or '*' in str(columns):
        logging.info(f'Found unresolved Star (*) in model {model.name}')

    return SqlModelInfo(
        name=model.name,
        file_name=model.file_name, 
        file_path=model.path,
        columns=truncated_columns,
        table_names=table_names
    )

def traverse(column: ColRef, truncated_columns: Set[ColRef]):

    if len(column.refs) > 0:
        for col in column.refs:
            traverse(col, truncated_columns)
        return truncated_columns
    truncated_columns.add(column)
    return truncated_columns

def truncateColumns(columns: List['ColRef'], model_name):
    truncated_columns = []

    for column in columns:
        inner_truncated = set()
        inner_cols = traverse(column, inner_truncated)
        truncated_columns.append(ColRef(name=column.name, table=model_name, refs=tuple(inner_cols)))

    return truncated_columns

def parseColumn(column: exp.Column, table_map: Dict[str, str], all_table_map: Dict[str, List['ColRef']], schema: Dict[str, List['ColRef']]):
    if column.name == '*':
        return expand_single_wildcard(column.table, table_map, all_table_map, schema)
        
    if not column.table and len(table_map) > 1:
        table_name = resolve_unqualified_column(column.name, table_map.values(), all_table_map, schema)
    else:
        table_name = next(iter(table_map)) if len(table_map) == 1 else get_table_from_column(column, table_map, all_table_map, schema)
    
    # FIX: Use case-insensitive matching (.lower()) to prevent keyword/casing mismatches
    col_name_lower = column.name.lower()
    
    if table_name in all_table_map:
        matched_refs = [c for c in all_table_map[table_name] if c.name.lower() == col_name_lower]
        return [ColRef(name=column.alias_or_name, table=table_name, refs=tuple(matched_refs))]
        
    elif table_name in schema:
        matched_refs = [c for c in schema[table_name] if c.name.lower() == col_name_lower]
        return [ColRef(name=column.alias_or_name, table=table_name, refs=tuple(matched_refs))]
    
    return [ColRef(name=column.alias_or_name, table=table_name)]

def parseSelect(query: Union[exp.Query, exp.CTE, exp.Subquery], all_table_map: Dict[str, List['ColRef']], schema: Dict[str, List['ColRef']]):
    # Unwrap CTEs or Subqueries to inspect the actual inner query
    inner_query = query.this if isinstance(query, (exp.CTE, exp.Subquery)) else query
    
    # FIX: Handle UNION queries by parsing both sides and zipping the lineage
    if isinstance(inner_query, exp.Union):
        # sqlglot Unions use `.this` for the left query and `.expression` for the right
        left_cols = parseSelect(inner_query.this, all_table_map, schema)
        right_cols = parseSelect(inner_query.expression, all_table_map, schema)
        
        combined_columns = []
        for i, l_col in enumerate(left_cols):
            # Combine the lineage trees from both branches of the UNION
            refs = [l_col]
            if i < len(right_cols):
                refs.append(right_cols[i])
                
            combined_columns.append(
                ColRef(name=l_col.name, table=query.alias_or_name or "UNION", refs=tuple(refs))
            )
        return combined_columns

    # Standard SELECT processing
    tables = list(query.find_all(exp.Table, bfs=False))
    table_map = {table.alias_or_name: table.name for table in tables}
    all_columns: List['ColRef'] = []

    for expr in query.selects:
        columns: List['ColRef'] = []
        
        if isinstance(expr, exp.Star):
            exp_cols = expand_full_wildcard(expr, tables, all_table_map, schema)
            all_columns.extend(exp_cols)
            continue

        if isinstance(expr, exp.Column):
            all_columns.extend(parseColumn(expr, table_map, all_table_map, schema))
            continue
        else:
            for column in expr.find_all(exp.Column):
                columns.extend(parseColumn(column, table_map, all_table_map, schema))

        if expr.alias_or_name == '*':
            all_columns.extend(columns)
        else: 
            all_columns.append(ColRef(name=expr.alias_or_name, table=query.alias_or_name, refs=tuple(columns)))

    return all_columns


def expand_single_wildcard(table_name: str, table_map: dict, table_column_map: Dict[str, List['ColRef']], schema: Dict[str, List['ColRef']]):
    table_name = table_map.get(table_name, table_name)
    
    if table_name in table_column_map:
        return list(table_column_map[table_name])
        
    if table_name in schema:
        return [ColRef(name=col.name, table=table_name) for col in schema[table_name]]
        
    return []


def expand_full_wildcard(expr: exp.Star, query_tables: List[exp.Table], table_column_map: Dict[str, List['ColRef']], schema: Dict[str, List['ColRef']]):
    cols: List['ColRef'] = []
    for table in query_tables:
        cols.extend(expand_single_wildcard(table.name, {table.name: table.name}, table_column_map, schema))
    return cols


def get_table_from_column(column: exp.Column, table_map: dict, all_table_map: Dict[str, List['ColRef']], schema: Dict[str, List['ColRef']]):
    table_name = column.table
    
    if table_name in table_map:
        return table_map[table_name]
    elif table_name in all_table_map or table_name in schema:
        return table_name
        
    logging.warning(f'Table {table_name} not found for Column {column.sql()}')
    return table_name




def resolve_unqualified_column(column_name: str, candidate_tables: Iterable[str], all_table_map: Dict[str, List['ColRef']], schema: Dict[str, List['ColRef']]) -> str:
    col_name_lower = column_name.lower()
    
    for table_name in candidate_tables:
        if table_name in all_table_map:
            # FIX: Case-insensitive match
            if any(col.name.lower() == col_name_lower for col in all_table_map[table_name]):
                return table_name
        elif table_name in schema:
            # FIX: Case-insensitive match
            if any(col.name.lower() == col_name_lower for col in schema[table_name]):
                return table_name
    return ""
