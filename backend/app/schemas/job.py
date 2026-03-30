from typing import List, Optional
from datetime import date
from app.schemas.base_schema import BaseSchema


class JobCreate(BaseSchema):
    title: str
    department: str
    location: str
    job_type: str
    deadline: date
    status: str = "Open"
    description: str
    required_skills: List[str] = []
    responsibilities: List[str] = []
    qualifications: List[str] = []
    recruiter_id: int


class JobUpdate(BaseSchema):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    qualifications: Optional[List[str]] = None


class JobResponse(BaseSchema):
    id: int
    title: str
    department: str
    location: str
    job_type: str
    deadline: date
    status: str
    description: str
    required_skills: List[str]
    responsibilities: List[str]
    qualifications: List[str]