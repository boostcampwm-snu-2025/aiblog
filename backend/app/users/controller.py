from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from backend.app.users.services  import UserService
from fastapi import Depends
from typing import Annotated
from backend.settings import AUTH_SETTINGS

user_router = APIRouter()

@user_router.get("/login")
async def login():
    return RedirectResponse(url=f"{AUTH_SETTINGS.GITHUB_AUTH_URL}?client_id={AUTH_SETTINGS.GITHUB_CLIENT_ID}&scope=public_repo")

@user_router.get("/callback")
async def callback(code: str, user_service: Annotated[UserService, Depends()]):
    access_token = await user_service.get_github_access_token(code)
    
    return {"access_token": access_token}