from pathlib import Path
from typing import List
from sqlmesh_parse import parse_sqlmesh
from sqlmesh.core.model.definition import SqlModel
import os
from sqlglot import exp
from sqlglot.optimizer.qualify import qualify

from sqlmesh.core.dialect import  MacroFunc, MacroVar
from sqlmesh.core.context import Context
from sqlmesh.core.macros import MacroEvaluator, normalize_macro_name, macro as macro_class
from sql_parser import ModelParser
from classes import RawModel, ColRef, TableReference

from sqlglot.schema import MappingSchema

from save_data import save_data_json


from typing import Dict
import typing as t

def run(path, outdir, filename):

    crawler = SqlMeshCrawler(path)

    parsed_models = crawler.parse_context()

    save_data_json(parsed_models, outdir, filename)

class SqlMeshCrawler:

    def __init__(self, path:str):
        self.path = path

        self.config_paths = self.find_sqlmesh_config_directories(path)

    def parse_context(self):    
            context = Context(paths=self.config_paths, load_state=False)

            macromapper: Dict[str, t.Callable] = dict()

            for mcname, mc in context._macros.items():
                if isinstance(mc, macro_class):
                    macromapper[normalize_macro_name(mcname)] = mc.func
                elif isinstance(mc, t.Callable):
                    macromapper[normalize_macro_name(mcname)] = mc

            raw_schema : dict[str, List[ColRef]] = {}
            schema = {}
            for model in context.models.values():

                columns = model.columns_to_types
                if columns:
                    coldic = {col[0]:col[1].name for col in columns.items()}
                    model_table_ref = TableReference(table_name=model.name, schema_name='', catalog_name='')
                    coldiccooler = [ColRef(name=col.name, table=model_table_ref) for col in columns.values()]

                    raw_schema[model.name] = coldiccooler
                    schema[model.name] = coldic

            mappingSchema = MappingSchema(schema)
            evaluator = MacroEvaluator(context.config.dialect, schema=mappingSchema)

            evaluator.macros = macromapper
           
            

            parsed_models = dict()
            for model in context.models.values():

                model.render_query()
                
                reqn = model.render_query()

                tables = model.depends_on
                
                file_path = Path(model._path) if model._path else '' 
                file_name = Path(model._path).name if model._path else ''
                if isinstance(reqn, exp.Query):

                    #querified = qualify(query, context.default_dialect, schema=mappingSchema)
                    parser = ModelParser(RawModel(model.name, str(file_path), file_name, reqn, tables), raw_schema, model.catalog, model.schema_name, model.view_name)
                    sql_model, unmatched_columns = parser.parse()
                    parsed_models[model.fqn] = sql_model

            return parsed_models


    def crawl_folders(self, paths: List[str]):
        sql_files = [self.crawl_folder(path) for path in paths]
        
        config_files = self.find_sqlmesh_config_directories(self.path)
        return [sql_files, config_files]
          
    
    def crawl_folder(self, path: str):
        root_path = Path(path)

        found_files = [str(file.resolve()) for file in root_path.rglob('*.sql')]

        return found_files


    def find_sqlmesh_config_directories(self, root_path: str):
        target_files = {'config.yaml', 'config.py'}
        found_dirs = []

        # Convert to absolute path to ensure accurate comparison
        root_path = os.path.abspath(root_path)

        for root, dirs, files in os.walk(root_path):
            
            if any(file in files for file in target_files):
                found_dirs.append(root)

        return found_dirs

