import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = "Recruitment System API"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads/resumes")

    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY")
    MISTRAL_MODEL: str = os.getenv("MISTRAL_MODEL", "mistral-large-latest")


settings = Settings()