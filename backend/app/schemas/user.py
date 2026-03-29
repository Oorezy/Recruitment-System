from typing import Optional
from pydantic import EmailStr
from app.schemas.base_schema import BaseSchema
from app.enums import UserRole


class UserCreate(BaseSchema):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: UserRole
    phone: Optional[str] = None


class UserLogin(BaseSchema):
    email: EmailStr
    password: str


class UserResponse(BaseSchema):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    role: UserRole