import os

from fastapi import FastAPI
from app.config import settings
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db
from app.routers import auth, jobs, recruiter

app = FastAPI(title=settings.APP_NAME)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


app.include_router(auth.router)
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(recruiter.router, prefix="/recruiter", tags=["Recruiter"])

@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} is running!"}