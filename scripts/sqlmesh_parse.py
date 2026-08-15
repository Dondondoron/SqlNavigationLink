from typing import List, Dict

from pathlib import Path
import os

import linecache
from collections import  defaultdict

from sqlmesh.core.context import Context
from sqlglot import  parse, ParseError
from sqlglot.expressions import Property, PropertyEQ, Exp, Expr

from sqlmesh.core.model.definition import _extract_blueprint_variables, SeedModel
from sqlmesh.core import constants as c
from sqlmesh.core.macros import macro
from sqlmesh.utils import UniqueKeyDict, sys_path
from sqlmesh.core.dialect import  MacroFunc, MacroVar
from sqlmesh.core.macros import MacroEvaluator, normalize_macro_name

def parse_sqlmesh(paths:List[str], config_files: List[str]):
    context = Context(paths=config_files, load=False)


    all_macros: UniqueKeyDict = UniqueKeyDict('macros')

    all_parsed_trees = {}
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
            
            filtered_paths = [
                path for path in paths 
                if Path(path).is_relative_to(loader.config_path)
            ]
            
            gateway = loader.config.default_gateway
    
            evaluator = MacroEvaluator()

            variables = {}
            
            for key, var in loader.config.variables.items():
                variables[key] = var
            variables[c.GATEWAY] = gateway

            evaluator.locals[c.SQLMESH_VARS] = variables

            

            #registry = macro.get_registry()
            evaluator.macros = {normalize_macro_name(k): v.func for k, v in all_macros.items()}
            parsed_trees = parse_files(filtered_paths, evaluator, loader.config.dialect)
            all_parsed_trees.update(parsed_trees)

    return all_parsed_trees


def parse_files(paths:List[str], evaluator:MacroEvaluator, dialect):
    
    parsed_trees = {}
    for path in paths:

        
        evaluator.locals[c.SQLMESH_BLUEPRINT_VARS] = {}
        with open(path, 'r', encoding='utf-8') as file:
            sql_content = file.read()

        expressions = parse(sql_content, dialect=dialect) 

        header = expressions[0]

        name = None
        if header is not None:
            args = header.args['expressions'] if 'expressions' in header.args else []
            for arg in args:
                if arg.alias_or_name == 'name':
                    
                    name = arg.args['value']
                if arg.alias_or_name == 'blueprints':
                    blueprint_variable_map = {}
                    for prop in arg.find_all(PropertyEQ):
                        blueprint_variables = _extract_blueprint_variables(prop, Path(path))
                        blueprint_variable_map.update(blueprint_variables)
                    evaluator.locals[c.SQLMESH_BLUEPRINT_VARS] = blueprint_variable_map

        if name:
            for v in name.find_all(MacroVar):
                v.replace(evaluator.transform(v))
                   
        expression = expressions[1]
        if expression is None:
             continue

        if isinstance(expression, MacroFunc) and expression.alias_or_name != 'INSERT_SEED':
            expressions[1] = evaluate_macro(expression, evaluator)
        elif expression.alias_or_name != 'INSERT_SEED':
            parse_macro(expression=expression, evaluator=evaluator)
        parsed_trees[path] = expressions

    return parsed_trees

def evaluate_macro(expression, evaluator:MacroEvaluator):
    try: 
        evaluated = evaluator.transform(expression)
        if isinstance(evaluated, MacroVar):
            evaluated = evaluator.evaluate(expression)
    
                
        expression.replace(evaluated)
        return evaluated
    except ParseError as e:
        print(f'Parse Error on MacroEvaluator: {e} on macro: {expression.sql()}')
        return expression
    except Exception as e:
        print(f'Parse Exception on MacroEvaluator: {e} on macro: {expression.sql()}')
        return expression

def parse_macro(expression, evaluator:MacroEvaluator):
    for macrofunc in expression.find_all(MacroVar):
        try: 
            evaluated = evaluator.transform(macrofunc)

            if isinstance(evaluated, MacroVar):
                evaluated = evaluator.evaluate(macrofunc)

            
            macrofunc.replace(evaluated)
        except ParseError as e:
            print(f'Parse Error on MacroEvaluator: {e} on macro: {macrofunc.sql()}')
            continue
        except Exception as e:
            print(f'Parse Exception on MacroEvaluator: {e} on macro: {macrofunc.sql()}')
            continue
    
    for macrofunc in expression.find_all(MacroFunc):
        try: 
            evaluated = evaluator.transform(macrofunc)

            if isinstance(evaluated, MacroFunc):
                evaluated = evaluator.evaluate(macrofunc)

            
            macrofunc.replace(evaluated)
        except ParseError as e:
            print(f'Parse Error on MacroEvaluator: {e} on macro: {macrofunc.sql()}')
            continue
        except Exception as e:
            print(f'Parse Exception on MacroEvaluator: {e} on macro: {macrofunc.sql()}')
            continue
    
