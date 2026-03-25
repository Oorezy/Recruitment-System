import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = "Recruitment System API"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads/resumes")


settings = Settings()