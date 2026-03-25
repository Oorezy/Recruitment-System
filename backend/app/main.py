import os

from fastapi import FastAPI
from config import settings
from fastapi.middleware.cors import CORSMiddleware
from db.init_db import init_db
from routers import auth

app = FastAPI(title=settings.APP_NAME)

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} is running!"}