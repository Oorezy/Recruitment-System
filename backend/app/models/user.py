from typing import Optional
from sqlmodel import SQLModel, Field
from app.enums import UserRole


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    email: str = Field(unique=True)
    password_hash: str
    role: UserRole
    phone: str
    