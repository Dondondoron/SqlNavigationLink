from typing import List
from sqlmesh.core.context import Context

from sqlglot import  parse, ParseError



def parse_files(paths: List[str]):
        parsed_trees = {}

        for path in paths:
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        sql_content = file.read()

                    expressions = parse(sql_content) 
                    parsed_trees[path] = expressions
                        

                except ParseError as e:
                    print(f"❌ Syntax error while parsing {path}: {e}")
                except Exception as e:
                    print(f"⚠️ Failed to read file {path}: {e}")

        return parsed_trees

            