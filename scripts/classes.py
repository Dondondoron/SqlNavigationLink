
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Tuple
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

class ColRef(BaseModel):
    model_config = {"frozen": True}
    name: str
    table: str
    refs: Tuple["ColRef", ...] = ()