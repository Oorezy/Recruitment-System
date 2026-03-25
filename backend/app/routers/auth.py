from fastapi import APIRouter

router = APIRouter()


@router.get("/auth")
def auth():
    return {"message": "Auth router working"}