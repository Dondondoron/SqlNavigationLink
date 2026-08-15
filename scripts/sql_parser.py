
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
        
        if sql_statement is None:
            continue

        tables = set(('.'.join([n for n in [table.db, table.catalog, table.name] if n != '']) for table in sql_statement.find_all(exp.Table)))
        filename = Path(model_key).name

        if isinstance(sql_statement, exp.Select):
            raw_schema[model_name] = [ColRef(name=sel, table=model_name) for sel in sql_statement.named_selects]
        raw_models.append(RawModel(model_name, model_key, filename, sql_statement, tables))


    sorted_models = sort(raw_models)

    #all_referenced_tables = {table for m in raw_models for table in m.tables}
    #raw_models.sort(key=lambda x: 0 if x.name in all_referenced_tables else 1)
    
    for model in sorted_models:
        
        try:
            
            sql_model, unmatched_columns = ModelParser(model, raw_schema).parse()
            model_tables[model.path] = sql_model

            if len(unmatched_columns):
                print(f'{sql_model.file_name} failed to procure the following columns:')
                for col in unmatched_columns:
                    print(f'• {col}')
                print(f'{sql_model.file_path}')
                print('-----------------')

            if model.name in raw_schema:
                schematic = raw_schema[model.name]
                if len(schematic) == 1:
                    raw_schema[model.name] = [ColRef(name=col.name, table=model.name) for col in sql_model.columns]
            
        except ParseError as e:
            logging.error(f"Error parsing SQL for model {model.path}: {e}")
            model_tables[model.path] = []
    return model_tables



class ModelParser:

    def __init__(self, model: 'RawModel', raw_schema: Dict[str, List['ColRef']]):
        self.model = model
        self.raw_schema = raw_schema
        self.unmatched_columns = set()

    def parse(self):
        model = self.model
        query = model.query
        uncte_query = query.copy()
        uncte_query.set("with_", None)


        table_column_map: Dict[str, List['ColRef']] = {}

        for cte in query.find_all(exp.CTE):
            for sq in cte.find_all(exp.Subquery):
                sub_refs = self.parseSelect(sq, table_column_map)
                table_column_map[sq.alias_or_name] = sub_refs

            cte_refs = self.parseSelect(cte, table_column_map)
            table_column_map[cte.alias_or_name] = cte_refs

        for sq in uncte_query.find_all(exp.Subquery):
            sub_refs = self.parseSelect(sq, table_column_map)
            table_column_map[sq.alias_or_name] = sub_refs

        cte_names: Set[str] = {cte.alias_or_name for cte in query.ctes} if hasattr(query, 'ctes') else set()
        sq_aliases: Set[str] = {sq.alias_or_name for sq in query.find_all(exp.Subquery)}

        columns = self.parseSelect(uncte_query, table_column_map)

        truncated_columns = self.truncateColumns(columns, model.name)

        table_names = {
            '.'.join([n for n in [table.db, table.catalog, table.name] if n != '']) 
            for table in query.find_all(exp.Table) 
            if table.alias_or_name not in cte_names 
            and table.name not in cte_names 
            and table.alias_or_name not in sq_aliases
        }

        if '*' in str(table_column_map) or '*' in str(columns):
            logging.warning(f'Found unresolved Star (*) in model {model.name}')
        return [SqlModelInfo(
            name=model.name,
            file_name=model.file_name, 
            file_path=model.path,
            columns=truncated_columns,
            table_names=table_names
        ), self.unmatched_columns]


    def traverse(self, column: ColRef, truncated_columns: Set[ColRef]):

        if len(column.refs) > 0:
            for col in column.refs:
                self.traverse(col, truncated_columns)
            return truncated_columns
        truncated_columns.add(column)
        return truncated_columns

    def truncateColumns(self, columns: List['ColRef'], model_name):
        truncated_columns = []

        for column in columns:
            inner_truncated = set()
            inner_cols = self.traverse(column, inner_truncated)
            truncated_columns.append(ColRef(name=column.name, table=model_name, refs=tuple(inner_cols)))

        return truncated_columns

    def parseColumn(self, column: exp.Column, table_map: Dict[str, str], all_table_map: Dict[str, List['ColRef']]):
        if column.name == '*':
            return self.expand_single_wildcard(column.table, table_map, all_table_map)

        if not column.table and len(table_map) > 1:
            table_name = self.resolve_unqualified_column(column.name, table_map.values(), all_table_map)
        else:
            table_name = next(iter(table_map.values())) if len(table_map) == 1 else self.get_table_from_column(column, table_map, all_table_map)

        if table_name == '':
            # 1. Filter and get only the schemas that exist in your map
            valid_schemas = [
                self.raw_schema[table]
                for table in table_map.values()
                if table in self.raw_schema
            ]

            # 2. Search for the matching column name
            for schema_table in valid_schemas:
                for stc in schema_table:
                    if stc.name == column.name:
                        table_name = stc.table
                        break  # Stop searching this table once found
                    
        
        

        # FIX: Use case-insensitive matching (.lower()) to prevent keyword/casing mismatches
        col_name_lower = column.name.lower()

        if table_name in all_table_map:
            matched_refs = [c for c in all_table_map[table_name] if c.name.lower() == col_name_lower]
            return [ColRef(name=column.alias_or_name, table=table_name, refs=tuple(matched_refs))]

        elif table_name in self.raw_schema:
            matched_refs = [c for c in self.raw_schema[table_name] if c.name.lower() == col_name_lower]
            return [ColRef(name=column.alias_or_name, table=table_name, refs=tuple(matched_refs))]
        
        #if '.' not in table_name and table_name != '':
        #            print('')

        return [ColRef(name=column.alias_or_name, table=table_name)]

    def parseSelect(self, query: Union[exp.Query, exp.CTE, exp.Subquery], all_table_map: Dict[str, List['ColRef']]):
        # Unwrap CTEs or Subqueries to inspect the actual inner query
        if not isinstance(query, (exp.Query, exp.CTE, exp.Subquery)):
                    return []
        inner_query = query.this if isinstance(query, (exp.CTE, exp.Subquery)) else query

        # FIX: Handle UNION queries by parsing both sides and zipping the lineage
        if isinstance(inner_query, exp.Union):
            # sqlglot Unions use `.this` for the left query and `.expression` for the right
            left_cols = self.parseSelect(inner_query.this, all_table_map)
            right_cols = self.parseSelect(inner_query.expression, all_table_map)

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
        table_map = {
            table.alias_or_name: '.'.join([n for n in [table.db, table.catalog, table.name] if n != ''])
            for table in tables
        }
        all_columns: List['ColRef'] = []

        

        for expr in query.selects:
            columns: List['ColRef'] = []

            if isinstance(expr, exp.Star):
                exp_cols = self.expand_full_wildcard(expr, tables, all_table_map)
                all_columns.extend(exp_cols)
                continue

            if isinstance(expr, exp.Column):
                all_columns.extend(self.parseColumn(expr, table_map, all_table_map))
                continue
            else:
                for column in expr.find_all(exp.Column):
                    columns.extend(self.parseColumn(column, table_map, all_table_map))

            if expr.alias_or_name == '*':
                all_columns.extend(columns)
            else: 
                all_columns.append(ColRef(name=expr.alias_or_name, table=query.alias_or_name, refs=tuple(columns)))

        return all_columns


    def expand_single_wildcard(self, table_name: str, table_map: dict, table_column_map: Dict[str, List['ColRef']]):
        table_name = table_map.get(table_name, table_name)

        if table_name in table_column_map:
            return list(table_column_map[table_name])

        if table_name in self.raw_schema:
            return [ColRef(name=col.name, table=table_name) for col in self.raw_schema[table_name]]

        return []


    def expand_full_wildcard(self, expr: exp.Star, query_tables: List[exp.Table], table_column_map: Dict[str, List['ColRef']]):
        cols: List['ColRef'] = []
        for table in query_tables:
            cols.extend(self.expand_single_wildcard(table.name, {table.name: table.name}, table_column_map))
        return cols


    def get_table_from_column(self, column: exp.Column, table_map: dict, all_table_map: Dict[str, List['ColRef']]):
        table_name = column.table

        if table_name in table_map:
            return table_map[table_name]
        elif table_name in all_table_map or table_name in self.raw_schema:
            return table_name

        self.unmatched_columns.add(column.sql())
        return table_name




    def resolve_unqualified_column(self, column_name: str, candidate_tables: Iterable[str], all_table_map: Dict[str, List['ColRef']]) -> str:
        col_name_lower = column_name.lower()

        for table_name in candidate_tables:
            if table_name in all_table_map:
                # FIX: Case-insensitive match
                if any(col.name.lower() == col_name_lower for col in all_table_map[table_name]):
                    return table_name
            elif table_name in self.raw_schema:
                # FIX: Case-insensitive match
                if any(col.name.lower() == col_name_lower for col in self.raw_schema[table_name]):
                    return table_name
        return ""
