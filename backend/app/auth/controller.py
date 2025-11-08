from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from backend.app.auth.service import auth_service
from backend.app.settings import AUTH_SETTINGS

auth_router = APIRouter()

@auth_router.post("/login")
def login():
    redirect_url = f"{AUTH_SETTINGS.GITHUB_AUTH_URL}?client_id={AUTH_SETTINGS.GITHUB_CLIENT_ID}&scope=read:user"

    return RedirectResponse(url=redirect_url)

@auth_router.get("/callback")
def callback(code: str):
    return auth_service.github_oauth_callback(code)