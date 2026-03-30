from datetime import datetime
from typing import List, Optional
from app.schemas.base_schema import BaseSchema
from app.enums import ApplicationStatus


class MyApplicationListResponse(BaseSchema):
    id: int
    job_title: str
    company_name: str
    status: ApplicationStatus
    applied_at: datetime
    resume_filename: Optional[str] = None

class MyApplicationDetailsResponse(BaseSchema):
    id: int
    job_title: str
    company_name: str
    status: ApplicationStatus
    applied_at: datetime
    skills: List[str] = []
    cover_letter: Optional[str] = None
    resume_filename: Optional[str] = None
    status_history: List[ApplicationHistoryResponse] = []

class ApplicationHistoryResponse(BaseSchema):
    status: ApplicationStatus
    comment: Optional[str] = None
    updated_at: datetime

class RecruiterApplicationListResponse(BaseSchema):
    job_title: str
    job_description: str
    applications: List[RecruiterApplicationsResponse] = []

class RecruiterApplicationsResponse(BaseSchema):
    id: int
    job_title: str
    job_description: str
    applicant_name: str
    email: str
    status: ApplicationStatus
    applied_at: datetime
    match_score: Optional[int] = None


class ApplicantDetailsResponse(BaseSchema):
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

class ApplicationStatusUpdate(BaseSchema):
    status: ApplicationStatus
