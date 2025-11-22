from typing import Annotated, List, Optional
from fastapi import Depends
from backend.app.posts.models import Post
from backend.app.posts.schemas import PostCreateRequest, PostUpdateRequest
from backend.app.posts.repositories import PostRepository

class PostService:
    def __init__(self, post_repository: Annotated[PostRepository, Depends()]) -> None:
        self.post_repository = post_repository

    def add_post(self, post_create_request: PostCreateRequest) -> Post:
        post = Post(
            title=post_create_request.title,
            content=post_create_request.content
        )
        return self.post_repository.add_post(post)

    def get_posts(self, skip: int = 0, limit: int = 100) -> List[Post]:
        return self.post_repository.get_posts(skip, limit)

    def get_post(self, post_id: int) -> Optional[Post]:
        return self.post_repository.get_post(post_id)

    def update_post(self, post_id: int, post_update: PostUpdateRequest) -> Optional[Post]:
        post = self.post_repository.get_post(post_id)
        if not post:
            return None
        
        post.title = post_update.title
        post.content = post_update.content
        return self.post_repository.update_post(post)

    def delete_post(self, post_id: int) -> bool:
        post = self.post_repository.get_post(post_id)
        if not post:
            return False
        
        self.post_repository.delete_post(post)
        return True
    