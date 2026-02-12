from pydantic import BaseModel,ConfigDict
from typing import List, Optional
from datetime import  datetime

# 1. New Schema for the list view
class ReportResponse(BaseModel):
    file_id: int
    file_name: str
    is_valid: bool
    error_msg: Optional[str]
    validated_date: datetime
    file_type: str
    username:str

    model_config = ConfigDict(from_attributes=True)

# 2. Updated Stats Schema
class DayStat(BaseModel):
    day: str
    total: int
    successful: int
    failed: int

class XMLStatsResponse(BaseModel):
    totalValidations: int
    successful: int
    failed: int
    avgTimeMs: int = 743
    last7Days: List[DayStat]
    period: dict
    
    model_config = ConfigDict(from_attributes=True)


class URLUpload(BaseModel):
    url: str