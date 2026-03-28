
from email.mime import application

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session, select

from app.db import session
from app.db.session import get_session
from app.models.user import User
from app.models.application import Application, ApplicationStatusHistory
from app.models.job import Job
from app.services.fileUpload import save_resume_file
from app.enums import UserRole
from app.schemas.application import MyApplicationListResponse


router = APIRouter()

@router.post("")
def submit_application(job_id: int = Form(...), 
    applicant_id: int = Form(...),
    cover_letter: str = Form(""),
    resume: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    applicant = session.get(User, applicant_id)

    if not applicant or applicant.role != UserRole.APPLICANT:
        raise HTTPException(status_code=404, detail="Applicant not found")  
    
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    existing_application = session.exec(
            select(Application).where(
                Application.applicant_id == applicant_id,
                Application.job_id == job_id
            )
        ).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied for this job")
        
    application = Application(
        job_id=job_id,
        applicant_id=applicant_id,
        cover_letter=cover_letter,
        status=Application.ApplicationStatus.APPLIED
    )

    if resume:
            save_path, original_name = save_resume_file(resume)
            application.resume_path = save_path
            application.resume_filename = original_name

        # Run api call to match resume with job

    session.add(application)
    session.commit()
    session.refresh(application)

    
    history = ApplicationStatusHistory(
            application_id=application.id,
            status=Application.ApplicationStatus.APPLIED,
            comment="Application submitted"
        )
    session.add(history)
    session.commit()

    return {"message": "Application submitted successfully", "application_id": application.id}


@router.get("/my", response_model=list[MyApplicationListResponse])
def get_my_applications(applicant_id: int, session: Session = Depends(get_session)):

    applicant = session.get(User, applicant_id)
    if not applicant or applicant.role != UserRole.APPLICANT:
        raise HTTPException(status_code=404, detail="Applicant not found")

    applications = session.exec(
        select(Application, Job)
        .join(Job, Job.id == Application.job_id)
        .where(Application.applicant_id == applicant_id)
    ).all()

    result = []
    for application, job in applications:
        result.append(MyApplicationListResponse(
            id=application.id,
            job_title=job.title,
            company_name="Google",
            status=application.status,
            applied_at=application.created_at,
        ))

    return {"applications": result}
