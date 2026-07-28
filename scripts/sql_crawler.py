from pathlib import Path
from typing import List


class SqlCrawler:

    def __init__(self, path:str, sql_type:str):
        self.sql_type = sql_type

        if sql_type == 'DBT':
                    from dbt_parse import DBTParser
                    self.dbt_parser = DBTParser(path)


    def parse_files(self, paths: List[str]):
            if self.sql_type == 'DBT':
                 return self.dbt_parser.parse_files(paths)
            elif self.sql_type == 'SQLMESH':
                 from sqlmesh_parse import parse_files
                 return parse_files(paths)
            return {}


    def crawl_folders(self, paths: List[str]):
        files = []
        for path in paths:
            files.append(self.crawl_folder(path))
        return files
    
    def crawl_folder(self, path: str):
        root_path = Path(path)

        found_files = [str(file.resolve()) for file in root_path.rglob('*.sql')]

        return found_files
