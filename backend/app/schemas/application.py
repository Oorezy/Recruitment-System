import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.enums import ApplicationStatus


class MyApplicationListResponse(BaseModel):
    id: int
    job_title: str
    company_name: str
    status: ApplicationStatus
    applied_at: datetime
    resume_filename: Optional[str] = None
    class Config:
        arbitrary_types_allowed = True

class MyApplicationDetailsResponse(BaseModel):
    id: int
    job_title: str
    company_name: str
    status: ApplicationStatus
    applied_at: datetime
    cover_letter: Optional[str] = None
    resume_filename: Optional[str] = None
    status_history: List[ApplicationHistoryResponse] = []
    class Config:
        arbitrary_types_allowed = True

class ApplicationHistoryResponse(BaseModel):
    status: ApplicationStatus
    note: Optional[str] = None
    updated_at: datetime
    class Config:
        arbitrary_types_allowed = True

class RecruiterApplicationListResponse(BaseModel):
    job_title: str
    job_description: str
    applications: List[RecruiterApplicationsResponse] = []

class RecruiterApplicationsResponse(BaseModel):
    id: int
    applicant_name: str
    email: str
    status: ApplicationStatus
    applied_at: datetime
    match_score: Optional[int] = None
    class Config:
        arbitrary_types_allowed = True


class ApplicantDetailsResponse(BaseModel):
    id: int
    applicant_name: str
    email: str
    phone: Optional[str] = None
    status: ApplicationStatus
    cover_letter: Optional[str] = None
    match_score: Optional[int] = None
    skills: List[str] = []
    matched_skills: List[str] = []
    resume_filename: Optional[str] = None
    experience_summary: Optional[str] = None
