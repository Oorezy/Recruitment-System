from typing import Optional
from pydantic import BaseModel, EmailStr
from enums import UserRole


class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    role: UserRole
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole

    class Config:
        from_attributes = True