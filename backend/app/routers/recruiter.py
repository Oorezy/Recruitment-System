from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.job import Job
from app.schemas.job import JobCreate, JobUpdate
from app.utils import (
    list_to_comma_string,
    list_to_newline_string,
    serialize_job,
)

router = APIRouter()

@router.get("/jobs")
def get_recruiter_jobs(recruiter_id: int, session: Session = Depends(get_session)):
    jobs = session.exec(select(Job).where(Job.recruiter_id == recruiter_id)).all()
    return {"jobs": [serialize_job(job) for job in jobs]}

@router.post("/jobs")
def create_job(job_data: JobCreate, session: Session = Depends(get_session)):
    job = Job(
        title=job_data.title,
        department=job_data.department,
        location=job_data.location,
        job_type=job_data.job_type,
        deadline=job_data.deadline,
        status=job_data.status,
        description=job_data.description,
        required_skills=list_to_comma_string(job_data.required_skills),
        responsibilities=list_to_newline_string(job_data.responsibilities),
        qualifications=list_to_newline_string(job_data.qualifications),
        recruiter_id=job_data.recruiter_id,
    )

    session.add(job)
    session.commit()
    session.refresh(job)

    return {
        "message": "Job created successfully",
        "job": serialize_job(job)
    }