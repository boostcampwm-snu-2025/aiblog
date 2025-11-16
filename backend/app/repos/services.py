import asyncio
import httpx
import google.generativeai as genai
from fastapi import HTTPException

from backend.app.repos.schemas import ChangeType, SummaryRequest
from backend.settings import AUTH_SETTINGS, LLM_SETTINGS

MAX_DIFF_CHARS = 12_000
SUMMARY_MODEL_FALLBACK = "gemini-1.5-flash"

class RepoService:
    def __init__(self):
        self._gemini_model_name = LLM_SETTINGS.GEMINI_MODEL or SUMMARY_MODEL_FALLBACK
        self._gemini_model = None
        if LLM_SETTINGS.GEMINI_API_KEY:
            genai.configure(api_key=LLM_SETTINGS.GEMINI_API_KEY)
            self._gemini_model = genai.GenerativeModel(self._gemini_model_name)

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

    async def generate_summary(self, access_token: str, payload: SummaryRequest) -> tuple[str, bool]:
        if not self._gemini_model:
            raise HTTPException(status_code=500, detail="Gemini API key is not configured")

        diff_text = await self._fetch_change_diff(access_token, payload)
        truncated = False
        if len(diff_text) > MAX_DIFF_CHARS:
            diff_text = diff_text[:MAX_DIFF_CHARS]
            truncated = True

        prompt = self._build_prompt(payload, diff_text, truncated)
        summary = await self._generate_with_gemini(prompt)
        return summary, truncated

    async def _fetch_change_diff(self, access_token: str, payload: SummaryRequest) -> str:
        if payload.change_type == ChangeType.commit:
            return await self._fetch_commit_diff(access_token, payload.owner, payload.repo, payload.sha)
        return await self._fetch_pr_diff(access_token, payload.owner, payload.repo, payload.number)

    async def _fetch_commit_diff(self, access_token: str, owner: str, repo: str, sha: str | None) -> str:
        if not sha:
            raise HTTPException(status_code=400, detail="Commit SHA is required")
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{AUTH_SETTINGS.GITHUB_API_URL}/repos/{owner}/{repo}/commits/{sha}",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3.diff",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to fetch commit diff: {response.text}"
            )
        return response.text

    async def _fetch_pr_diff(self, access_token: str, owner: str, repo: str, number: int | None) -> str:
        if number is None:
            raise HTTPException(status_code=400, detail="Pull request number is required")
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{AUTH_SETTINGS.GITHUB_API_URL}/repos/{owner}/{repo}/pulls/{number}",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3.diff",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to fetch pull request diff: {response.text}"
            )
        return response.text

    def _build_prompt(self, payload: SummaryRequest, diff_text: str, truncated: bool) -> str:
        descriptor = "commit" if payload.change_type == ChangeType.commit else "pull request"
        title = payload.title or "(no title)"
        description = payload.description or "(no description provided)"
        author = payload.author or "unknown"
        repo_path = f"{payload.owner}/{payload.repo}"
        truncated_note = "The diff was truncated for length. Focus on the portion provided." if truncated else ""

        prompt = f"""
You are an assistant helping developers summarize key GitHub changes.
Summarize the {descriptor} below in Korean with the following structure:
1. **요약** – 2 문장으로 전체 변화를 설명합니다.
2. **주요 변경 사항** – bullet 리스트 (최대 4개)로 핵심 수정 사항을 적습니다.
3. **영향 및 후속 조치** – 잠재적인 영향이나 필요한 후속 작업을 1문장으로 설명합니다.

Repository: {repo_path}
Author: {author}
Title: {title}
Description: {description}
Reference URL: {payload.html_url or 'N/A'}
{truncated_note}

Diff to summarize:
```
{diff_text}
```
"""
        return prompt

    async def _generate_with_gemini(self, prompt: str) -> str:
        if not self._gemini_model:
            raise HTTPException(status_code=500, detail="Gemini model is not configured")
        try:
            response = await asyncio.to_thread(self._gemini_model.generate_content, prompt)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Gemini API error: {exc}") from exc

        if not response or not getattr(response, "text", None):
            raise HTTPException(status_code=502, detail="Received empty response from Gemini API")

        return response.text.strip()