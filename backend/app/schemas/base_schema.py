from datetime import datetime
from pydantic import BaseModel

class BaseSchema(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.strftime('%d-%m-%Y')  # Format as dd-MM-YYYY
        }
