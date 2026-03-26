from fastapi import APIRouter, Depends, HTTPException

from app.security import hash_password, verify_password
from app.db.session import get_session
from app.schemas.user import UserCreate, UserLogin, UserResponse
from sqlmodel import Session, select
from app.models.user import User

router = APIRouter()


@router.get("/auth")
def auth():
    return {"message": "Auth router working"}

@router.post("/auth/register")
def register(formData: UserCreate, session: Session = Depends(get_session)):

    new_user = User(
        first_name=formData.firstName,
        last_name=formData.lastName,
        email=formData.email,
        password_hash=hash_password(formData.password),
        role=formData.role,
        phone=formData.phone
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/auth/login", response_model=UserResponse)
def login(formData: UserLogin, session: Session = Depends(get_session)):

    user = session.exec(
        select(User).where(User.email == formData.email)
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(formData.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return UserResponse(
            id=user.id,
            firstName=user.first_name,
            lastName=user.last_name,
            email=user.email,
            role=user.role
        )
    
    

