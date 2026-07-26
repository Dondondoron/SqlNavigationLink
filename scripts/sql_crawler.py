import os
from pathlib import Path
from typing import List, Optional

from sqlmesh.core.context import Context

from sqlglot import exp, parse
from sqlglot.errors import ParseError

from pydantic import BaseModel, ConfigDict
from collections import defaultdict

import json
import warnings
import sys
import itertools

warnings.filterwarnings("ignore")

class SqlModelInfo(BaseModel):
    name: str
    file_name: str
    file_path: str

    table_names: set
    cte_names: set


class TableInfo(BaseModel):
    model_config = ConfigDict(frozen=True)
    fullname: str
    name: str
    db: Optional[str]
    catalog: Optional[str]
    alias:Optional[str]
    fields: frozenset[str]


class SqlCrawler:

    def parse_files(self, paths: List[str]):
            parsed_trees = {}

            for path in paths:
                #print(f"Parsing: {path}")
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        sql_content = file.read()

                    # sqlglot.parse returns a list of expressions (one for each statement)
                    # Tip: pass read="dialect_name" (e.g., read="snowflake") if relevant
                    expressions = parse(sql_content) 

                    parsed_trees[path] = expressions

                except ParseError as e:
                    pass
                    #print(f"❌ Syntax error while parsing {path}: {e}")
                except Exception as e:
                    pass
                    #print(f"⚠️ Failed to read file {path}: {e}")

            return parsed_trees


    def parse_sql_models_and_extract_tables(self, models):
        # Dict to store tables found per model
        model_tables = {}

        for model_key, model_value in models.items():
            # Assuming model[1] contains the raw SQL string

            model_header = model_value[0]

            model_name = ''
            sql_statement = None

            if len(model_value) == 1:
                model_name = model_key
                sql_statement =  model_value[0]
            elif len(model_value) > 1:
                
                sql_statement =  model_value[1]
                for expr in model_header.expressions:
                    if expr.name == 'name':
                        model_name = str(expr.args['value'])
            

            if sql_statement is None:
                continue

            if model_name == 'reddit_seven_day_trending':
                print()
            try:


                filename = Path(model_key).name
                sql_model = self.parseCTELess(
                    model_name=model_name,
                    filename=filename,
                    file_path=model_key,
                    query=sql_statement)

                model_tables[model_key] = sql_model

            except ParseError as e:
                print(f"Error parsing SQL for model {model_key}: {e}")
                model_tables[model_key] = []

        return model_tables


    def parseCTELess(self, model_name:str, filename:str, file_path:str, query: exp.Select):
        uncte_query = query.copy()
        uncte_query.set("with_", None)

        tables = self.parseSelect(uncte_query)

        ctes : set[TableInfo] = set()

        cte_names = {cte.alias_or_name.lower() for cte in query.ctes}


        for cte in query.find_all(exp.CTE):
            cte_tables = self.parseSelect(cte)
            tables |= cte_tables  # Or: tables.update(cte_tables)

        for table in set(tables):
            ref_table_name = table.fullname
            if ref_table_name.lower() in cte_names:
                            ctes.add(table)
                            tables.remove(table)
            
        
        return SqlModelInfo(name=model_name,
                             file_name=filename , 
                             file_path=file_path, 
                             table_names=tables, 
                             cte_names=ctes)

    def parseTableFields(self, query:exp.Select|exp.CTE):
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

    def parseSelect(self, query: exp.Select|exp.CTE):
         
                table_fields, unprefixed_fields = self.parseTableFields(query)
                
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
                return tables

    def crawl_folders(self, paths: List[str]):
        files = []
        for path in paths:
            files.append(self.crawl_folder(path))
        return files
    
    def crawl_folder(self, path: str):
        root_path = Path(path)

        # Use file.resolve() to get absolute paths, or str(file) for relative paths
        found_files = [str(file.resolve()) for file in root_path.rglob('*.sql')]

        return found_files


if __name__ == '__main__':
    crawler = SqlCrawler()

    sql_paths = []

    if len(sys.argv) > 1:
        raw_arg = sys.argv[1].strip("'\"")
        
        # 1. Try parsing as JSON array (for VS Code extension execFile)
        try:
            parsed = json.loads(raw_arg)
            if isinstance(parsed, list):
                sql_paths = parsed
            elif isinstance(parsed, str):
                sql_paths = [parsed]
        except json.JSONDecodeError:
            # 2. Fallback: Treat CLI arguments directly as raw folder paths
            # This handles standard debug arguments like: python script.py "E:/path"
            sql_paths = [arg.strip("'\"") for arg in sys.argv[1:]]

    # Flatten nested folder lists from crawl_folders
    raw_folders = crawler.crawl_folders(sql_paths)

    # Flatten any nested lists/sublists into a single list of string file paths
    folders = list(itertools.chain.from_iterable(
        sublist if isinstance(sublist, list) else [sublist] 
        for sublist in raw_folders
    ))

    parsed_queries = crawler.parse_files(folders)
    sql_models = crawler.parse_sql_models_and_extract_tables(parsed_queries)

    # Use mode='json' so Pydantic converts set[TableInfo] -> list[dict]

    output_data = {
        key: model.model_dump(mode='json') if hasattr(model, 'model_dump') else model
        for key, model in sql_models.items()
    }

    if len(sys.argv) > 2:
        output_file_path = sys.argv[2]
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f)
    else:
        # Fallback to stdout for quick manual CLI testing
        print(json.dumps(output_data))