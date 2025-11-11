from typing import Annotated
from backend.app.repos.services import RepoService
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.repos.schemas import CommitResponse, RepoResponse, PullRequestResponse

repo_router = APIRouter()

security_scheme = HTTPBearer()

@repo_router.get("")
async def get_repos(
    repo_service: Annotated[RepoService, Depends()],
    token: HTTPAuthorizationCredentials = Depends(security_scheme)
):
    access_token = token.credentials
    repos = await repo_service.get_user_public_repos(access_token)
    return [RepoResponse(
        id=repo["id"],
        name=repo["name"],
        full_name=repo["full_name"],
        default_branch=repo["default_branch"],
        html_url=repo["html_url"],
        description=repo["description"],
        owner_login=repo["owner"]["login"],
        owner_avatar_url=repo["owner"]["avatar_url"],
        pushed_at=repo.get("pushed_at"),
        updated_at=repo.get("updated_at")
    ) for repo in repos
    ]

@repo_router.get("/commits")
async def get_commits(
    owner: str,
    repo: str,
    repo_service: Annotated[RepoService, Depends()],
    per_page: int = 10,
    token: HTTPAuthorizationCredentials = Depends(security_scheme),
):
    access_token = token.credentials
    commits = await repo_service.get_user_commits(access_token, owner, repo, per_page)
    return [CommitResponse(
        sha=commit["sha"],
        html_url=commit["html_url"],
        message=commit["commit"]["message"],
        date=commit["commit"]["committer"]["date"],
        owner_login=commit["author"]["login"] if commit.get("author") else "unknown",
        owner_avatar_url=commit["author"]["avatar_url"] if commit.get("author") else ""
    ) for commit in commits
    ]

@repo_router.get("/prs")
async def get_pull_requests(
    owner: str,
    repo: str,
    repo_service: Annotated[RepoService, Depends()],
    token: HTTPAuthorizationCredentials = Depends(security_scheme),
):
    access_token = token.credentials
    prs = await repo_service.get_user_pull_requests(access_token, owner, repo)
    return [PullRequestResponse(
        id=pr["id"],
        html_url=pr["html_url"],
        title=pr["title"],
        body=pr["body"],
        state=pr["state"],
        created_at=pr["created_at"],
        updated_at=pr["updated_at"],
        merged_at=pr["merged_at"],
        author_login=pr["user"]["login"],
        author_avatar_url=pr["user"]["avatar_url"]
    ) for pr in prs
    ]