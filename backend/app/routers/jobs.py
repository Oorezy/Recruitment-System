from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.utils import serialize_job
from app.db.session import get_session
from app.models.job import Job
from app.schemas.job import JobResponse

router = APIRouter()

@router.get("")
def get_jobs(session: Session = Depends(get_session)):
    jobs = session.exec(select(Job)).all()
    return [serialize_job(job) for job in jobs]
    

@router.get("/{job_id}")
def get_job(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return serialize_job(job)   