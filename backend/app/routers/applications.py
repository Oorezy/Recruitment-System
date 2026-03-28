
from email.mime import application

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session

from app.db import session
from app.db.session import get_session
from app.models.user import User
from app.models.application import Application, ApplicationStatusHistory
from app.models.job import Job
from app.services.fileUpload import save_resume_file


router = APIRouter()

@router.post("")
def submit_application(job_id: int = Form(...), 
    applicant_id: int = Form(...),
    cover_letter: str = Form(""),
    resume: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    applicant = session.get(User, applicant_id)

    if not applicant or applicant.role != "applicant":
        raise HTTPException(status_code=404, detail="Applicant not found")  
    
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Handle if application FileExistsError
        
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
            application=application,
            status=Application.ApplicationStatus.APPLIED,
            comment="Application submitted"
        )
    session.add(history)
    session.commit()

    return {"message": "Application submitted successfully", "application_id": application.id}
