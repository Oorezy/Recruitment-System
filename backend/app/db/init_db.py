from sqlmodel import SQLModel
from app.db.session import engine

# import models so SQLModel knows them
from app.models.user import User
from app.models.job import Job
from app.models.application import Application, ApplicationStatusHistory


def init_db() -> None:
    SQLModel.metadata.create_all(engine)