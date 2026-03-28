import os
import shutil
from uuid import uuid4
from fastapi import UploadFile
from app.config import settings


def save_resume_file(file: UploadFile) -> tuple[str, str]:
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid4().hex}{ext}"
    save_path = os.path.join(settings.UPLOAD_DIR, unique_name)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return save_path, file.filename