from fastapi import APIRouter
from backend.app.users.controller import user_router
from backend.app.repos.controller import repo_router

api_router = APIRouter()

api_router.include_router(user_router, prefix="/users", tags=["users"])
api_router.include_router(repo_router, prefix="/repos", tags=["repos"])