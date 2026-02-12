from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ReportResponse(BaseModel):
    file_id: int
    file_name: str
    is_valid: bool
    error_msg: Optional[str]
    validated_date: datetime
    file_type: str
    username: str
    execution_time: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

