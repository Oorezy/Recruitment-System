from datetime import date
from typing import Optional
from sqlmodel import SQLModel, Field


class Job(SQLModel, table=True):
    __tablename__ = "jobs"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    department: str
    location: str
    job_type: str
    deadline: date
    status: str = "Open"
    required_skills: str 
    responsibilities: str = ""
    qualifications: str = ""
    created_at: str