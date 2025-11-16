from datetime import datetime
from enum import Enum
from pydantic import BaseModel, model_validator


class ChangeType(str, Enum):
    commit = "commit"
    pull_request = "pull_request"

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
    number: int
    html_url: str
    title: str
    body: str | None = None
    state: str
    created_at: datetime
    updated_at: datetime
    merged_at: datetime | None = None
    author_login: str
    author_avatar_url: str


class SummaryRequest(BaseModel):
    change_type: ChangeType
    owner: str
    repo: str
    sha: str | None = None
    number: int | None = None
    title: str | None = None
    description: str | None = None
    author: str | None = None
    html_url: str | None = None

    @model_validator(mode="after")
    def validate_reference(self):
        if self.change_type == ChangeType.commit and not self.sha:
            raise ValueError("sha is required for commit summaries")
        if self.change_type == ChangeType.pull_request and self.number is None:
            raise ValueError("number is required for pull request summaries")
        return self


class SummaryResponse(BaseModel):
    summary: str
    truncated: bool = False