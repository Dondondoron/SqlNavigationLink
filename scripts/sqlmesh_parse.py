from typing import List, Dict

from pathlib import Path


import linecache
from collections import  defaultdict

from sqlmesh.core.context import Context
from sqlglot import  parse, ParseError

from sqlmesh.core import constants as c
from sqlmesh.utils import UniqueKeyDict, sys_path
from sqlmesh.core.dialect import  MacroFunc
from sqlmesh.core.macros import MacroEvaluator, normalize_macro_name

def parse_sqlmesh(paths:List[str], config_files: List[str]):
    context = Context(paths=config_files, load=False)


    all_macros: UniqueKeyDict = UniqueKeyDict('macros')
    
    for loader in context._loaders:
         with sys_path(loader.config_path):
            linecache.clearcache()
            loader._path_mtimes.clear()

            loader._load_materializations()
            signals = loader._load_signals()

            config_mtimes: Dict[Path, List[float]] = defaultdict(list)

            for config_file in loader.config_path.glob("config.*"):
                loader._track_file(config_file)
                config_mtimes[loader.config_path].append(loader._path_mtimes[config_file])

            for config_file in c.SQLMESH_PATH.glob("config.*"):
                loader._track_file(config_file)
                config_mtimes[c.SQLMESH_PATH].append(loader._path_mtimes[config_file])

            loader._config_mtimes = {path: max(mtimes) for path, mtimes in config_mtimes.items()}

            macros, macro_registry = loader._load_scripts()
            all_macros.update(macros)

    

    parsed_trees = parse_files(paths, all_macros)
 

    return parsed_trees


def parse_files(paths:List[str], macros):
    evaluator = MacroEvaluator()
    evaluator.macros = {normalize_macro_name(k): v.func for k, v in macros.items()}
    parsed_trees = {}
    for path in paths:
        try:
            with open(path, 'r', encoding='utf-8') as file:
                sql_content = file.read()

            expressions = parse(sql_content) 

            expression = expressions[1]

            if expression is None:
                 continue
            
            parse_macro(expression=expression, evaluator=evaluator)
            parsed_trees[path] = expressions

        except ParseError as e:
            print(f"❌ Syntax error while parsing {path}: {e}")
        except Exception as e:
            print(f"⚠️ Failed to read file {path}: {e}")
    return parsed_trees

def parse_macro(expression, evaluator):
    for macrofunc in list(expression.find_all(MacroFunc)):
        try: 
            evaluated = evaluator.evaluate(macrofunc)
        
            evaluator.eval_expression(macrofunc)
            macrofunc.replace(evaluated)
        except ParseError as e:
            print(f'Parse Error on MacroEvaluator: {e} on macro: {macrofunc.sql()}')
            continue
        except Exception:
            print(f'Parse Exception on MacroEvaluator: {e} on macro: {macrofunc.sql()}')
            continue
    
