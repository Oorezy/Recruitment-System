from fastapi import APIRouter, Depends

from security import hash_password
from db.session import get_session
from schemas.user import UserCreate, UserLogin
from sqlmodel import Session
from models.user import User

router = APIRouter()


@router.get("/auth")
def auth():
    return {"message": "Auth router working"}

@router.post("/auth/register")
def register(formData: UserCreate, session: Session = Depends(get_session)):
    
    new_user = User(
        full_name=formData.full_name,
        email=formData.email,
        password_hash=hash_password(formData.password),
        role=formData.role,
        phone=formData.phone
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/auth/login")
def login(form_data: UserLogin, session: Session = Depends(get_session)):
    return {"message": "Login endpoint working"}

