from backend.settings import AUTH_SETTINGS
import httpx
from fastapi import HTTPException

class UserService:
    def __init__(self) -> None:
        pass

    async def get_github_access_token(self, code: str):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                AUTH_SETTINGS.GITHUB_TOKEN_URL,
                headers={"Accept": "application/json"},
                data={
                    "client_id": AUTH_SETTINGS.GITHUB_CLIENT_ID,
                    "client_secret": AUTH_SETTINGS.GITHUB_CLIENT_SECRET,
                    "code": code
                }
            )
            response_data: dict = response.json()
            
            access_token = response_data.get("access_token")
        
            return access_token