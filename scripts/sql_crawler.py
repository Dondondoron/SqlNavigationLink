import os
from pathlib import Path
from typing import List, Optional

from sqlmesh.core.context import Context

from sqlglot import exp, parse
from sqlglot.errors import ParseError

from pydantic import BaseModel, ConfigDict

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


class TableInfo(BaseModel):
    model_config = ConfigDict(frozen=True)
    fullname: str
    name: str
    db: Optional[str]
    catalog: Optional[str]


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

            for expr in model_header.expressions:
                if expr.name == 'name':
                    model_name = str(expr.args['value'])
            

            if len(model_value) < 2:
                continue

            sql_statement =  model_value[1]

            try:
                # Parse the SQL into an AST (Abstract Syntax Tree)
                parsed = sql_statement

                # Find all Table expressions in the AST
                tables = set()
                for table in parsed.find_all(exp.Table):
                    # sqlglot naturally includes CTE names as Table expressions.
                    # We extract the actual table name string here.
             
                    
                    tables.add(TableInfo(fullname= str(table), name=table.name, db=table.db, catalog=table.catalog))

                # Find all CTE names so we can filter them out of our physical tables list
                ctes = set()
                for cte in parsed.find_all(exp.CTE):
                    ctes.add(cte.alias_or_name)

                # Physical tables are tables found minus the internal CTE aliases
                physical_tables = tables - ctes


                filename = Path(model_key).name
                sql_model = SqlModelInfo(name=model_name, file_name=filename , file_path=model_key, table_names=set(physical_tables))

                model_tables[model_key] = sql_model
                
                #print(f"Model: {model_key}")
                #print(f"  Found Tables: {list(physical_tables)}")
                #print(f"  Found CTEs (ignored): {list(ctes)}\n")

            except ParseError as e:
                #print(f"Error parsing SQL for model {model_key}: {e}")
                model_tables[model_key] = []

        return model_tables

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