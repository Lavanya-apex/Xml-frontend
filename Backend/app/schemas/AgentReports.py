from typing import List
from pydantic import BaseModel

class LocalResult(BaseModel):
    file_name: str
    is_valid: bool
    error: str

class AgentReport(BaseModel):
    results: List[LocalResult]