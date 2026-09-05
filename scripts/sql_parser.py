
from __future__ import annotations
from pathlib import Path
from typing import List, Dict, Union, Set, Iterable, Optional
from sqlglot.errors import ParseError
from sqlglot import exp
from classes import SqlModelInfo, ColRef, Ref, RawModel, TableReference
import json
import logging
from graphlib import TopologicalSorter
from itertools import chain


def sort(raw_models: List[RawModel]):
    # 1. Map names to objects
    model_map = {m.name: m for m in raw_models}

    # 2. FAST DEPENDENCY LOOKUP (Runs in O(N) instead of O(N^2))
    # Build a lookup dictionary: table_name -> set of models that reference it
    referenced_by = {}
    for m in raw_models:
        for table_ref in m.tables:
            # Use the logical table name as the key when tracking dependencies
            table_key = table_ref.table_name if isinstance(table_ref, TableReference) else str(table_ref)
            if table_key not in referenced_by:
                referenced_by[table_key] = set()
            referenced_by[table_key].add(m.name)

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

        tables = set((TableReference(table_name=table.name, schema_name=table.db, catalog_name=table.catalog) for table in sql_statement.find_all(exp.Table)))
        filename = Path(model_key).name

        if isinstance(sql_statement, exp.Select):
            model_table_ref = TableReference(table_name=model_name, schema_name='', catalog_name='')
            raw_schema[model_name] = [ColRef(name=sel, table=model_table_ref) for sel in sql_statement.named_selects]
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
                    model_table_ref = TableReference(table_name=model.name, schema_name='', catalog_name='')
                    raw_schema[model.name] = [ColRef(name=col.name, table=model_table_ref) for col in sql_model.columns]
            
        except ParseError as e:
            logging.error(f"Error parsing SQL for model {model.path}: {e}")
            model_tables[model.path] = []
    return model_tables



class ModelParser:

    def __init__(self, model: 'RawModel', raw_schema: Dict[str, List['ColRef']], catalog:str = '', schema:str = '', table_name:Optional[str] = None):
        self.model = model
        self.raw_schema = raw_schema
        self.unmatched_columns = set()
        self.catalog = catalog
        self.schema = schema
        self.table_name = table_name if table_name else model.name

    def parse(self):
        model = self.model
        query = model.query
        uncte_query = query.copy()
        uncte_query.set("with_", None)


        table_column_map: Dict[str, List['ColRef']] = {}

        for cte in query.find_all(exp.CTE):
            for sq in cte.find_all(exp.Subquery):
                sub_lineage = self.parseSelect(cte.alias_or_name,sq, table_column_map)
                table_column_map[sq.alias_or_name] = sub_lineage

            cte_lineage = self.parseSelect(cte.alias_or_name,cte, table_column_map)
            table_column_map[cte.alias_or_name] = cte_lineage

        for sq in uncte_query.find_all(exp.Subquery):
            sub_lineage = self.parseSelect(sq.alias_or_name,sq, table_column_map)
            table_column_map[sq.alias_or_name] = sub_lineage

        cte_names: Set[str] = {cte.alias_or_name for cte in query.ctes} if hasattr(query, 'ctes') else set()
        sq_aliases: Set[str] = {sq.alias_or_name for sq in query.find_all(exp.Subquery)}

        columns = self.parseSelect(model.name, uncte_query, table_column_map)

        truncated_columns = self.truncateColumns(columns, model.name)

        table_names = {
            TableReference(table_name=table.name, schema_name=table.db, catalog_name=table.catalog) 
            for table in query.find_all(exp.Table) 
            if table.alias_or_name not in cte_names 
            and table.name not in cte_names 
            and table.alias_or_name not in sq_aliases
        }

        if '*' in str(table_column_map) or '*' in str(columns):
            logging.warning(f'Found unresolved Star (*) in model {model.name}')
        return [SqlModelInfo(
            name=model.name,
            table_name=self.table_name,
            table_schema=self.schema,
            catalog=self.catalog,
            file_name=model.file_name, 
            file_path=model.path,
            columns=columns,
            table_names=table_names
        ), self.unmatched_columns]


    def traverse(self, column: Ref, truncated_columns: Set[ColRef]):

        if len(column.refs) > 0:
            for col in column.refs:
                self.traverse(col, truncated_columns)
            return truncated_columns
        if isinstance(column, ColRef):
            truncated_columns.add(column)
        return truncated_columns

    def truncateColumns(self, columns: List['ColRef'], model_name):
        truncated_columns = []

        model_table_ref = TableReference(table_name=model_name, schema_name='', catalog_name='')
        for column in columns:
            inner_truncated = set()
            inner_cols = self.traverse(column, inner_truncated)
            truncated_columns.append(ColRef(name=column.name, table=model_table_ref, refs=tuple(inner_cols)))

        return truncated_columns

    def parseColumn(self, column: exp.Column, table_map: Dict[str, TableReference], all_table_map: Dict[str, List['ColRef']]):
        if column.name == '*':
            return self.expand_single_wildcard(column.table, table_map, all_table_map)

        # table_name is the string identifier (alias or full name) used in maps
        table_name: str = ""

        if not column.table and len(table_map) > 1:
            table_name = self.resolve_unqualified_column(column.name, table_map.values(), all_table_map)
        else:
            if len(table_map) == 1:
                # When there is only one table, use its alias/key
                table_name = next(iter(table_map.keys()))
            else:
                table_name = self.get_table_from_column(column, table_map, all_table_map)

        if table_name == '':
            # 1. Filter and get only the schemas that exist in your map
            valid_schemas = [
                self.raw_schema[table_ref.get_full_name()]
                for table_ref in table_map.values()
                if table_ref.get_full_name() in self.raw_schema
            ]

            # 2. Search for the matching column name
            for schema_table in valid_schemas:
                for stc in schema_table:
                    if stc.name == column.name:
                        # stc.table is a TableReference
                        table_name = stc.table.get_full_name()
                        break  # Stop searching this table once found
                    
        
        

        # FIX: Use case-insensitive matching (.lower()) to prevent keyword/casing mismatches
        col_name_lower = column.name.lower()

        # Derive a TableReference for this column
        table_ref: Optional[TableReference] = None
        if table_name in table_map:
            table_ref = table_map[table_name]
        elif table_name and table_name in self.raw_schema and len(self.raw_schema[table_name]) > 0:
            first_col = self.raw_schema[table_name][0]
            if isinstance(first_col.table, TableReference):
                table_ref = first_col.table
        if table_ref is None:
            table_ref = TableReference(table_name=table_name, schema_name='', catalog_name='')

        if table_name in all_table_map:
            matched_refs = [c for c in all_table_map[table_name] if c.name.lower() == col_name_lower]
            return [ColRef(name=column.alias_or_name, table=table_ref, refs=tuple(matched_refs))]

        elif table_name in self.raw_schema:
            matched_refs = [c for c in self.raw_schema[table_name] if c.name.lower() == col_name_lower]
            return [ColRef(name=column.alias_or_name, table=table_ref, refs=tuple(matched_refs))]
        
        return [ColRef(name=column.alias_or_name, table=table_ref)]

    def parseSelect(self, name:str, query: Union[exp.Query, exp.CTE, exp.Subquery], all_table_map: Dict[str, List['ColRef']]):
        # Unwrap CTEs or Subqueries to inspect the actual inner query
        if not isinstance(query, (exp.Query, exp.CTE, exp.Subquery)):
                    return []
        inner_query = query.this if isinstance(query, (exp.CTE, exp.Subquery)) else query

        # FIX: Handle UNION queries by parsing both sides and zipping the lineage
        if isinstance(inner_query, exp.Union):
            # sqlglot Unions use `.this` for the left query and `.expression` for the right
            left_lineage = self.parseSelect('union', inner_query.this, all_table_map)
            right_lineage = self.parseSelect('union', inner_query.expression, all_table_map)

            combined_columns : List[ColRef] = []
            for i, l_col in enumerate(left_lineage):
                # Combine the lineage trees from both branches of the UNION
                refs = [l_col]
                if i < len(right_lineage):
                    refs.append(right_lineage[i])

                combined_columns.append(
                    ColRef(name=l_col.name, table=TableReference(table_name=query.alias_or_name or "UNION", schema_name='', catalog_name=''), refs=tuple(refs))
                )
            return combined_columns

        # Standard SELECT processing
        tables = list(query.find_all(exp.Table, bfs=False))
        table_map = {
            table.alias_or_name: TableReference(table_name=table.name, schema_name=table.db, catalog_name=table.catalog)
            for table in tables
        }
        #all_columns: List['ColRef'] = []

        all_lineages: List[ColRef] = []

        for expr in query.selects:
            columns: List['ColRef'] = []

            if isinstance(expr, exp.Star):
                exp_cols = self.expand_full_wildcard(expr, tables, all_table_map)
                all_lineages.extend(exp_cols)
                continue

            if isinstance(expr, exp.Column):
                all_lineages.extend(self.parseColumn(expr, table_map, all_table_map))
                continue
            else:
                looped = self.loop_column_lineage(expr, table_map, all_table_map)
                all_lineages.append(ColRef(name=expr.alias_or_name, table=TableReference(table_name=name, schema_name='', catalog_name=''), refs=tuple(looped)))
                #for column in expr.find_all(exp.Column):
                #    
                #    columns.extend(self.parseColumn(column, table_map, all_table_map))

            if expr.alias_or_name == '*':
                all_lineages.extend(columns)
            #else: 
            #    all_lineages.append(ColRef(name=expr.alias_or_name, table=query.alias_or_name, refs=tuple(columns)))

        return all_lineages

    def loop_column_lineage(self, expr, table_map, all_table_map) -> List[Ref|ColRef]:
        if isinstance(expr, exp.Column):
            return [col for col in self.parseColumn(expr, table_map, all_table_map)]
        elif isinstance(expr, (exp.Alias, exp.Paren)):
            return self.loop_column_lineage(expr.args['this'], table_map, all_table_map)
        elif isinstance(expr, exp.DataType):
            return [Ref(name=str(expr.this.value))]
        elif isinstance(expr, exp.Literal):
            return [Ref(name=str(f'literal:{expr.this}'))]
        elif isinstance(expr, exp.Anonymous):
            return [
                    Ref( name=expr.name,
                    refs=tuple(
                        chain.from_iterable(
                            self.loop_column_lineage(v, table_map, all_table_map)
                            for v in expr.args.values()
                            if v is not None and not isinstance(v, exp.Identifier)
                    )
                ),
            )
        ]
        elif isinstance(expr, exp.Expr):
            return [
                    Ref(
                name=expr.key,
                refs=tuple(
                    chain.from_iterable(
                        self.loop_column_lineage(v, table_map, all_table_map)
                        for v in expr.args.values()
                        if v is not None and not isinstance(v, exp.Identifier)
                    )
                ),
            )
        ]
        elif isinstance(expr, list):
            return list(chain.from_iterable(self.loop_column_lineage(i, table_map, all_table_map) for i in expr))
        return []

    def expand_single_wildcard(self, table_name: str, table_map: Dict[str, TableReference], table_column_map: Dict[str, List['ColRef']]):
        """
        Expand a single-table wildcard (e.g. t.*).

        table_name is the alias or table identifier used in the query.
        table_map maps aliases/identifiers to TableReference instances.
        """
        alias = table_name
        table_ref = table_map.get(alias)
        full_name = table_ref.get_full_name() if table_ref else alias

        # Prefer lineage from CTE/subquery map using alias
        if alias in table_column_map:
            return list(table_column_map[alias])

        # Fallback to raw schema using fully qualified name
        if full_name in self.raw_schema:
            return [ColRef(name=col.name, table=col.table) for col in self.raw_schema[full_name]]

        return []


    def expand_full_wildcard(self, expr: exp.Star, query_tables: List[exp.Table], table_column_map: Dict[str, List['ColRef']]):
        cols: List['ColRef'] = []
        for table in query_tables:
            table_ref = TableReference(table_name=table.name, schema_name=table.db, catalog_name=table.catalog)
            cols.extend(self.expand_single_wildcard(table.name, {table.name: table_ref}, table_column_map))
        return cols


    def get_table_from_column(self, column: exp.Column, table_map: Dict[str, TableReference], all_table_map: Dict[str, List['ColRef']])-> str:
        table_name = column.table

        if table_name in table_map:
            return table_name
        elif table_name in all_table_map:
            return table_name
        elif table_name in self.raw_schema:
            return table_name

        self.unmatched_columns.add(column.sql())
        return table_name or ""




    def resolve_unqualified_column(self, column_name: str, candidate_tables: Iterable[TableReference], all_table_map: Dict[str, List['ColRef']]) -> str:
        col_name_lower = column_name.lower()

        for table_ref in candidate_tables:
            table_name = table_ref.get_full_name()
            if table_name in all_table_map:
                # FIX: Case-insensitive match
                if any(col.name.lower() == col_name_lower for col in all_table_map[table_name]):
                    return table_name
            elif table_name in self.raw_schema:
                # FIX: Case-insensitive match
                if any(col.name.lower() == col_name_lower for col in self.raw_schema[table_name]):
                    return table_name
        return ""
