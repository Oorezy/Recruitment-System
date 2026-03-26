from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from db.session import get_session
from models.job import Job
from schemas.job import JobResponse

router = APIRouter()

@router.get("")
def get_jobs(session: Session = Depends(get_session)):
    jobs = session.exec(select(Job)).all()
    return JobResponse()


@router.get("/{job_id}")
def get_job(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobResponse()