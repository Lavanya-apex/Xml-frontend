from pydantic import BaseModel, ConfigDict
from typing import Optional, Generic, TypeVar, Any

# 1. Define a Type Variable (T represents any data type)
T = TypeVar("T")

# 2. Inherit from BOTH BaseModel and Generic[T]
class APIResponse(BaseModel, Generic[T]):
    status: str
    message: str
    data: Optional[T] = None

    model_config = ConfigDict(from_attributes=True)