import datetime
from typing import Optional
from pydantic import BaseModel
from app.enums import ApplicationStatus


class MyApplicationListResponse(BaseModel):
    id: int
    job_title: str
    company_name: str
    status: ApplicationStatus
    applied_at: datetime

    class Config:
        arbitrary_types_allowed = True
