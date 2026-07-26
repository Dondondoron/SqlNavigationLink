from sql_crawler import SqlCrawler
from sql_parser import parse_sql_models_and_extract_tables
import sys
import json
import itertools

if __name__ == '__main__':

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

    
    crawler = SqlCrawler()
    raw_folders = crawler.crawl_folders(sql_paths)

    # Flatten any nested lists/sublists into a single list of string file paths
    folders = list(itertools.chain.from_iterable(
        sublist if isinstance(sublist, list) else [sublist] 
        for sublist in raw_folders
    ))

    parsed_queries = crawler.parse_files(folders, dbt=True)
    sql_models = parse_sql_models_and_extract_tables(parsed_queries)

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