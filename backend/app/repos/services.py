import httpx
from backend.settings import AUTH_SETTINGS
from fastapi import HTTPException

class RepoService:
    def __init__(self):
        pass

    async def get_user_public_repos(self, access_token: str) -> list[dict]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{AUTH_SETTINGS.GITHUB_API_URL}/user/repos?type=public",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            )
            
            if response.status_code != 200:
                print(f"GitHub API Error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"GitHub API error: {response.json()}"
                )
            
            repos_data: list = response.json()
            return repos_data

    async def get_user_commits(self, access_token: str, owner: str, repo: str, per_page: int = 10) -> list[dict]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{AUTH_SETTINGS.GITHUB_API_URL}/repos/{owner}/{repo}/commits?per_page={per_page}",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            )
            
            if response.status_code != 200:
                print(f"GitHub API Error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"GitHub API error: {response.json()}"
                )
            
            commits_data: list = response.json()
            return commits_data
        
    async def get_user_pull_requests(self, access_token: str, owner: str, repo: str) -> list[dict]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{AUTH_SETTINGS.GITHUB_API_URL}/repos/{owner}/{repo}/pulls?state=all",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            )
            
            if response.status_code != 200:
                print(f"GitHub API Error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"GitHub API error: {response.json()}"
                )
            
            prs_data: list = response.json()
            return prs_data