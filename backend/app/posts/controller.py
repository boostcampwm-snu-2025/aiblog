from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException

from backend.app.posts.schemas import PostCreateRequest, PostUpdateRequest, PostResponse
from backend.app.posts.services import PostService

post_router = APIRouter()

@post_router.post("/")
def create_post(
    request: PostCreateRequest, 
    post_service: Annotated[PostService, Depends()]
):
    post = post_service.add_post(request)
    return PostResponse(id=post.id, title=post.title, content=post.content, created_at=post.created_at, updated_at=post.updated_at)

@post_router.get("/")
def read_posts(
    post_service: Annotated[PostService, Depends()],
    skip: int = 0, 
    limit: int = 100
):
    posts = post_service.get_posts(skip, limit)
    return [PostResponse(id=post.id, title=post.title, content=post.content, created_at=post.created_at, updated_at=post.updated_at) for post in posts]

@post_router.get("/{post_id}")
def read_post(post_id: int, post_service: Annotated[PostService, Depends()]):
    post = post_service.get_post(post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostResponse(id=post.id, title=post.title, content=post.content, created_at=post.created_at, updated_at=post.updated_at)

@post_router.put("/{post_id}")
def update_post(
    post_id: int, 
    post_update: PostUpdateRequest, 
    post_service: Annotated[PostService, Depends()]
):
    post = post_service.update_post(post_id, post_update)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostResponse(id=post.id, title=post.title, content=post.content, created_at=post.created_at, updated_at=post.updated_at)

@post_router.delete("/{post_id}")
def delete_post(post_id: int, post_service: Annotated[PostService, Depends()]):
    success = post_service.delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"ok": True}

