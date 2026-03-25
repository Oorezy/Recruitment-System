from typing import Optional
from sqlmodel import SQLModel, Field
from enums import ApplicationStatus


class Application(SQLModel, table=True):
    __tablename__ = "applications"

    id: Optional[int] = Field(default=None, primary_key=True)
    applicant_id: int = Field(foreign_key="users.id")
    job_id: int = Field(foreign_key="jobs.id")
    cover_letter: Optional[str] = None
    status: ApplicationStatus = ApplicationStatus.APPLIED
    match_score: Optional[int] = None
    matched_skills: Optional[str] = ""
    created_at: str


class ApplicationStatusHistory(SQLModel, table=True):
    __tablename__ = "application_status_history"

    id: Optional[int] = Field(default=None, primary_key=True)
    application_id: int = Field(foreign_key="applications.id")
    status: ApplicationStatus
    note: Optional[str] = None
    updated_at: str