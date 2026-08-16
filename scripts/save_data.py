
import json
from pathlib import Path

def save_data_json(all_models: dict, output_path, file_name):

        
        output_data = {
            key: model.model_dump(mode='json') if hasattr(model, 'model_dump') else model
            for key, model in all_models.items()
        }

        out_dir =  Path(output_path)
    
        if Path(output_path).exists():
            output_file_path = Path.joinpath(out_dir, file_name)
            with open(output_file_path, 'w', encoding='utf-8') as f:
                json.dump(output_data, f)
        else:
            # Fallback to stdout for quick manual CLI testing
            print(json.dumps(output_data))