from typing import List
from app.schemas.job import JobResponse
from app.models.job import Job


def list_to_comma_string(values: List[str]) -> str:
    return ", ".join(v.strip() for v in values if v and v.strip())


def list_to_newline_string(values: List[str]) -> str:
    return "\n".join(v.strip() for v in values if v and v.strip())


def comma_string_to_list(value: str) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def newline_string_to_list(value: str) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split("\n") if item.strip()]

def serialize_job(job: Job) -> JobResponse:
    return JobResponse(
        id=job.id,
        title=job.title,
        department=job.department,
        location=job.location,
        job_type=job.job_type,
        deadline=job.deadline,
        status=job.status,
        description=job.description,
        required_skills=comma_string_to_list(job.required_skills),
        responsibilities=newline_string_to_list(job.responsibilities),
        qualifications=newline_string_to_list(job.qualifications),
    )