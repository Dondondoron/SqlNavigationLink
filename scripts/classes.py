
from pydantic import BaseModel, ConfigDict
from typing import Optional

class SqlModelInfo(BaseModel):
    name: str
    file_name: str
    file_path: str

    table_names: set
    cte_names: set

    columns: Optional[dict] = None
    cte_columns: Optional[dict] = None


class TableInfo(BaseModel):
    model_config = ConfigDict(frozen=True)
    fullname: str
    name: str
    db: Optional[str]
    catalog: Optional[str]
    alias:Optional[str]
    fields: frozenset[str]
