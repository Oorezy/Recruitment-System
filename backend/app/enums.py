from enum import Enum


class UserRole(str, Enum):
    APPLICANT = "applicant"
    RECRUITER = "recruiter"


class ApplicationStatus(str, Enum):
    APPLIED = "Applied"
    UNDER_REVIEW = "Under Review"
    SHORTLISTED = "Shortlisted"
    INTERVIEW = "Interview"
    OFFER = "Offer"
    REJECTED = "Rejected"