from sql_crawler import SqlCrawler
from sql_parser import parse_sql_models_and_extract_tables
import sys
import json
import itertools

if __name__ == '__main__':

    all_models = dict()

    count = 2
    while count < len(sys.argv) - 1:
        path = sys.argv[count]
        sql_type = sys.argv[count+1]


        crawler = SqlCrawler(path, sql_type)

        raw_folders = crawler.crawl_folders([path])

        folders = list(itertools.chain.from_iterable(
            sublist if isinstance(sublist, list) else [sublist] 
            for sublist in raw_folders
        ))

        parsed_queries = crawler.parse_files(folders)
        sql_models = parse_sql_models_and_extract_tables(parsed_queries)

        all_models.update(sql_models)

        count += 2

    
    output_data = {
        key: model.model_dump(mode='json') if hasattr(model, 'model_dump') else model
        for key, model in all_models.items()
    }

    if len(sys.argv) > 1:
        output_file_path = sys.argv[1]
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f)
    else:
        # Fallback to stdout for quick manual CLI testing
        print(json.dumps(output_data))