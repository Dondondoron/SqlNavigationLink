from typing import List
from sqlmesh.core.context import Context
from sqlglot import  parse, ParseError

from sqlmesh.utils import UniqueKeyDict, sys_path
from sqlmesh.core.dialect import  MacroFunc
from sqlmesh.core.macros import MacroEvaluator, normalize_macro_name

def parse_sqlmesh(paths:List[str], config_files: List[str]):
    context = Context(paths=config_files, load=False)


    all_macros: UniqueKeyDict = UniqueKeyDict('macros')
    
    for loader in context._loaders:
         with sys_path(loader.config_path):
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
            
            for macrofunc in list(expression.find_all(MacroFunc)):
                evaluated = evaluator.evaluate(macrofunc)
                
                evaluator.eval_expression(macrofunc)
                macrofunc.replace(evaluated)

            parsed_trees[path] = expressions

        except ParseError as e:
            print(f"❌ Syntax error while parsing {path}: {e}")
        except Exception as e:
            print(f"⚠️ Failed to read file {path}: {e}")
    return parsed_trees


