import os
from pathlib import Path
from typing import List

from sqlmesh.core.context import Context

from sqlglot import  parse
from sqlglot.errors import ParseError


import re
import warnings
import yaml


from jinja2 import Environment, Undefined

warnings.filterwarnings("ignore")



def extract_dbt_variables(project_dir: str) -> dict:
    """
    Reads a dbt_project.yml file and extracts all configured variables.
    """
    project_path = Path(project_dir) / "dbt_project.yml"
    
    if not project_path.exists():
        print(f"⚠️ dbt_project.yml not found at: {project_path}")
        return {}
        
    try:
        with open(project_path, "r", encoding="utf-8") as file:
            # Use SafeLoader to securely read the YAML configurations
            config = yaml.load(file, Loader=yaml.SafeLoader)
            
        # dbt variables are defined under the top-level 'vars' key
        dbt_vars = config.get("vars", {})
        
        # Flatten dictionary if variables contain nested path rules
        flattened_vars = {}
        
        def flatten(d):
            for key, val in d.items():
                if isinstance(val, dict):
                    # Recurse down nested model/directory configs
                    flatten(val)
                else:
                    flattened_vars[key] = val
                    
        if isinstance(dbt_vars, dict):
            flatten(dbt_vars)
            return flattened_vars
        else:
            print("⚠️ 'vars' key found but it is not a valid dictionary object.")
            return {}

    except yaml.YAMLError as e:
        print(f"❌ YAML Parsing Error: {e}")
        return {}
    except Exception as e:
        print(f"❌ Failed to read dbt project file: {e}")
        return {}

class CatchAllUndefined(Undefined):
    """
    Catches any undefined variable or function inside {% %} or {{ }}
    and prevents Jinja from throwing an UndefinedError.
    """
    def __call__(self, *args, **kwargs):
        if self._undefined_name == 'is_incremental':
            return False 
        if self._undefined_name == 'is_leap_year':
            return False 
        return f"/* macro_{self._undefined_name} */"

    def __bool__(self):
        return False

    def __str__(self):
        return f"/* undefined_{self._undefined_name} */"

    def __getattr__(self, item):
        # Handles nested properties (e.g., dbt_utils.surrogate_key or target.name)
        return CatchAllUndefined(name=f"{self._undefined_name}.{item}")


class CatchAllGlobals(dict):
    def __getitem__(self, key):
        # If Jinja looks for a missing function/macro, return a dynamic lambda
        if key not in self:
            return lambda *args, **kwargs: f"/* macro_{key} */"
        return super().__getitem__(key)




class SqlCrawler:

    def __init__(self, path:str, sql_type:str):
        self.env = Environment()
        self.sql_type = sql_type

        if sql_type == 'dbt':
            extracted_vars = extract_dbt_variables(path)
    
            self.env.globals = CatchAllGlobals({
                "ref": lambda *args: f"public.{args[-1]}",
                "source": lambda source_name, table_name: f"{source_name}.{table_name}",
                "var": lambda name, default=None: extracted_vars.get(name, default or f"/* var_{name} */")
            })

            self.env.undefined = CatchAllUndefined


    def parse_files(self, paths: List[str]):
            parsed_trees = {}

            for path in paths:
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        sql_content = file.read()

                    if self.sql_type == 'dbt':
                        clean_sql = re.sub(r"{{\s*config\([\s\S]*?\)\s*}}", "", sql_content)

                        template = self.env.from_string(clean_sql)
                        rendered_sql = template.render()
                        pexpressions = parse(rendered_sql)
                        parsed_trees[path] = pexpressions
                        

                    else:
                        expressions = parse(sql_content) 
                        parsed_trees[path] = expressions

                except ParseError as e:
                    
                    print(f"❌ Syntax error while parsing {path}: {e}")
                except Exception as e:
                    print(f"⚠️ Failed to read file {path}: {e}")

            return parsed_trees


    def crawl_folders(self, paths: List[str]):
        files = []
        for path in paths:
            files.append(self.crawl_folder(path))
        return files
    
    def crawl_folder(self, path: str):
        root_path = Path(path)

        found_files = [str(file.resolve()) for file in root_path.rglob('*.sql')]

        return found_files
