from pathlib import Path
from typing import List
import os

class SqlCrawler:

    def __init__(self, path:str, sql_type:str):
        self.sql_type = sql_type

        self.path = path

        if sql_type == 'DBT':
                    from dbt_parse import DBTParser
                    self.dbt_parser = DBTParser(path)


    def parse_files(self, paths: List[str]):
            if self.sql_type == 'DBT':
                 return self.dbt_parser.parse_files(paths)
            elif self.sql_type == 'SQLMESH':
                 from sqlmesh_parse import parse_sqlmesh
                 return parse_sqlmesh(paths)
            return {}


    def crawl_folders(self, paths: List[str]):
        files = []
        if self.sql_type == 'SQLMESH':
             return self.find_sqlmesh_config_directories(self.path)
        for path in paths:
            files.append(self.crawl_folder(path))
        return files
    
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

