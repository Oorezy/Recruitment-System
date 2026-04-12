import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.job import Job
from app.models.application import Application, ApplicationStatusHistory
from app.models.user import User
from app.schemas.job import JobCreate, JobResponse, JobUpdate
from app.schemas.application import RecruiterApplicationListResponse, RecruiterApplicationsResponse, ApplicantDetailsResponse, ApplicationStatusUpdate
from app.enums import ApplicationStatus
from app.utils import (
    comma_string_to_list,
    list_to_comma_string,
    list_to_newline_string,
    serialize_job,
)

router = APIRouter()

@router.get("/jobs", response_model=list[JobResponse])
def get_recruiter_jobs(recruiter_id: int, session: Session = Depends(get_session)):
    user = session.get(User, recruiter_id)
    if not user or user.role != "recruiter":
        raise HTTPException(status_code=400, detail="Invalid recruiter ID")
    
    jobs = session.exec(select(Job).where(Job.recruiter_id == recruiter_id)).all()
    return [serialize_job(job) for job in jobs]

@router.post("/jobs", status_code=201)
def create_job(job_data: JobCreate, session: Session = Depends(get_session)):
    user = session.get(User, job_data.recruiter_id)
    if not user or user.role != "recruiter":
        raise HTTPException(status_code=400, detail="Invalid recruiter ID")

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

    return {"message": "Job created successfully"}

@router.put("/jobs/{job_id}")
def update_job(job_id: int, job_data: JobUpdate, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
#Validate user
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

@router.get("/applications", response_model=list[RecruiterApplicationsResponse])
def get_recruiter_applications(recruiter_id: int, session: Session = Depends(get_session)):
    user = session.get(User, recruiter_id)
    if not user or user.role != "recruiter":
        raise HTTPException(status_code=400, detail="Invalid recruiter ID")

    applications = session.exec(select(Application, User, Job)
        .join(User, User.id == Application.applicant_id)
        .join(Job, Job.id == Application.job_id)
        .where(Job.recruiter_id == recruiter_id)).all()
    

    return [RecruiterApplicationsResponse(
                id=application.id,
                applicant_name=user.first_name + " " + user.last_name,
                email=user.email,
                status=application.status,
                applied_at=application.created_at,
                match_score=application.match_score,
                job_title=job.title,
                job_description=job.description
            )
        for application, user, job in applications]

@router.get("/jobs/{job_id}/applications", response_model=list[RecruiterApplicationsResponse])
def get_job_applications(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    rows = session.exec(
        select(Application, User, Job)
        .join(User, User.id == Application.applicant_id)
        .join(Job, Job.id == Application.job_id)
        .where(Application.job_id == job_id)
    ).all()

    return [RecruiterApplicationsResponse(
                id=application.id,
                applicant_name=user.first_name + " " + user.last_name,
                email=user.email,
                status=application.status,
                applied_at=application.created_at,
                match_score=application.match_score,
                job_title=job.title,
                job_description=job.description
            )
            for application, user, job in rows]

@router.put("/applications/{application_id}/status")
def update_application_status(application_id: int, payload: ApplicationStatusUpdate, session: Session = Depends(get_session)):
    application = session.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    status_value = payload.status
    if not status_value:
        raise HTTPException(status_code=400, detail="Status is required")

    try:
        application.status = ApplicationStatus(status_value)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")

    session.add(application)
    session.commit()
    session.refresh(application)

    history = ApplicationStatusHistory(
        application_id=application.id,
        status=application.status,
        comment=f"Application status updated to {application.status}"
    )
    session.add(history)
    session.commit()

    return {"message": "Application status updated successfully"}

@router.get("/applications/{application_id}", response_model=ApplicantDetailsResponse)
def get_candidate_details(application_id: int, session: Session = Depends(get_session)):
    application = session.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    user = session.get(User, application.applicant_id)
    if not user:
        raise HTTPException(status_code=404, detail="Applicant not found")

    return ApplicantDetailsResponse(
        id=application.id,
        applicant_name=user.first_name + " " + user.last_name,
        email=user.email,
        phone=user.phone,
        status=application.status,
        cover_letter=application.cover_letter,
        match_score=application.match_score,
        skills=comma_string_to_list(application.skills or ""),
        matched_skills=comma_string_to_list(application.matched_skills or ""),
        resume_filename=application.resume_filename,
    )

@router.get("/applications/{application_id}/resume", response_class=FileResponse)
def download_applicant_resume(
    application_id: int,
    session: Session = Depends(get_session)
):
    application = session.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if not application.resume_path:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not os.path.exists(application.resume_path):
        raise HTTPException(status_code=404, detail="Resume file does not exist on disk")

    return FileResponse(
        path=application.resume_path,
        filename=application.resume_filename,
        media_type="application/pdf"
    )