from pydantic import BaseModel,ConfigDict
from typing import List, Optional
from datetime import date

class XSDRequest(BaseModel):
    xsd_name: str
    xsd_content: str
class XSDResponse(BaseModel):
    xsd_id: int
    xsd_name: str
    xsd_content: str
    username: str

    model_config = ConfigDict(from_attributes=True)