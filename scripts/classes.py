
from pydantic import BaseModel, ConfigDict, model_serializer
from typing import Optional, List, Tuple, Dict, Any
from dataclasses import dataclass
from sqlglot import exp

class SqlModelInfo(BaseModel):
    name: str
    file_name: str
    file_path: str

    table_names: set = set()
    cte_names: set = set()

    columns: Optional[List] = []
    cte_columns: Optional[dict] = None


class TableInfo(BaseModel):
    model_config = ConfigDict(frozen=True)
    fullname: str
    name: str
    db: Optional[str]
    catalog: Optional[str]
    alias:Optional[str]
    fields: frozenset[str]

@dataclass
class RawModel:
    name:str
    path:str
    file_name:str
    query:exp.Query
    tables:set

class Ref(BaseModel):
    model_config = {"frozen": True}
    name: str
    refs: Tuple["ColRef|Ref", ...] = ()

class ColRef(Ref):
    table: str

    @model_serializer(mode="wrap")
    def serialize_model(self, handler) -> Dict[str, Any]:
        # Let Pydantic do its standard serialization first
        data = handler(self)
        
        # Explicitly build the dictionary in your desired key order
        return {
            "name": data.get("name"),
            "table": data.get("table"),
            "refs": data.get("refs")
        }