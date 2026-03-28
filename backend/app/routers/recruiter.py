from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.job import Job
from app.models.application import Application
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate
from app.schemas.application import RecruiterApplicationListResponse, RecruiterApplicationsResponse
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

@router.put("/jobs/{job_id}")
def update_job(job_id: int, job_data: JobUpdate, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    update_data = job_data.model_dump(exclude_unset=True)

    if "title" in update_data:
        job.title = update_data["title"]
    if "department" in update_data:
        job.department = update_data["department"]
    if "location" in update_data:
        job.location = update_data["location"]
    if "job_type" in update_data:
        job.job_type = update_data["job_type"]
    if "deadline" in update_data:
        job.deadline = update_data["deadline"]
    if "status" in update_data:
        job.status = update_data["status"]
    if "description" in update_data:
        job.description = update_data["description"]
    if "required_skills" in update_data:
        job.required_skills = list_to_comma_string(update_data["required_skills"])
    if "responsibilities" in update_data:
        job.responsibilities = list_to_newline_string(update_data["responsibilities"])
    if "qualifications" in update_data:
        job.qualifications = list_to_newline_string(update_data["qualifications"])

    session.add(job)
    session.commit()
    session.refresh(job)

    return {
        "message": "Job updated successfully",
        "job": serialize_job(job)
    }


@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    session.delete(job)
    session.commit()

    return {"message": "Job deleted successfully"}

@router.get("/jobs/{job_id}/applications", response_model=RecruiterApplicationListResponse)
def get_job_applications(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    rows = session.exec(
        select(Application, User)
        .join(User, User.id == Application.applicant_id)
        .where(Application.job_id == job_id)
    ).all()

    return RecruiterApplicationListResponse(
        job_title=job.title,
        job_description=job.description,
        applications=[
            RecruiterApplicationsResponse(
                id=application.id,
                applicant_name=user.full_name,
                email=user.email,
                status=application.status,
                applied_at=application.created_at,
                match_score=application.match_score
            )
            for application, user in rows
        ]
    )