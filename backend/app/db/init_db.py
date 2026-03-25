from sqlmodel import SQLModel
from db.session import engine

# import models so SQLModel knows them
from models.user import User
from models.job import Job
from models.application import Application, ApplicationStatusHistory


def init_db() -> None:
    SQLModel.metadata.create_all(engine)