from pydantic import BaseModel
from datetime import datetime

class RepoResponse(BaseModel):
    id: int
    name: str
    full_name: str
    html_url: str
    description: str | None = None
    default_branch: str
    pushed_at: datetime | None = None
    updated_at: datetime | None = None
    owner_login: str
    owner_avatar_url: str

class CommitResponse(BaseModel):
    sha: str
    html_url: str
    message: str
    date: datetime
    owner_login: str
    owner_avatar_url: str

class PullRequestResponse(BaseModel):
    id: int
    html_url: str
    title: str
    body: str | None = None
    state: str
    created_at: datetime
    updated_at: datetime
    merged_at: datetime | None = None
    author_login: str
    author_avatar_url: str
    state: str