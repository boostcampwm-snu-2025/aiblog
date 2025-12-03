from pydantic import BaseModel
from datetime import datetime


class PostBase(BaseModel):
    title: str
    content: str

class PostCreateRequest(PostBase):
    pass

class PostUpdateRequest(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True