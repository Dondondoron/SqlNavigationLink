from sql_crawler import SqlCrawler
from sql_parser import parse_sql_models_and_extract_tables
import sys
import json
import itertools
from save_data import save_data_json

#import debugpy
#if not debugpy.is_client_connected():
#    # Listen on localhost, port 5678
#    debugpy.listen(("127.0.0.1", 5678))
#    print("🤖 Debugger waiting for VS Code to attach on port 5678...", flush=True)
#    
#    # This line freezes script execution until you connect from VS Code
#    debugpy.wait_for_client() 
#    
#    # Optional: Hardcode an initial breakpoint right after connection
#    debugpy.breakpoint() 

if __name__ == '__main__':

    all_models = dict()


    out_path = sys.argv[1]
    out_path_file = sys.argv[2]
    sql_type = sys.argv[3]
    config_paths = sys.argv[4:]

    if sql_type == 'SQLMESH':
        from sqlmesh_crawler import run
        run(config_paths, out_path, out_path_file) 


    else:
        crawler = SqlCrawler(config_paths[0], sql_type)

        raw_folders, config_files = crawler.crawl_folders(config_paths)

        folders = list(itertools.chain.from_iterable(
            sublist if isinstance(sublist, list) else [sublist] 
            for sublist in raw_folders
        ))

        parsed_queries = crawler.parse_files(folders, config_files)
        sql_models = parse_sql_models_and_extract_tables(parsed_queries)

        all_models.update(sql_models)

        save_data_json(sql_models, out_path, out_path_file)
