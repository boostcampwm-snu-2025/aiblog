from typing import Annotated, List, Optional
from fastapi import Depends

from sqlalchemy.orm import Session
from backend.app.database import get_db_session
from backend.app.posts.models import Post

class PostRepository:
    def __init__(self, session: Annotated[Session, Depends(get_db_session)] ) -> None:
        self.session = session

    def add_post(self, post: Post) -> Post:
        self.session.add(post)
        self.session.commit()
        self.session.refresh(post)
        return post

    def get_posts(self, skip: int = 0, limit: int = 100) -> List[Post]:
        return self.session.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    def get_post(self, post_id: int) -> Optional[Post]:
        return self.session.query(Post).filter(Post.id == post_id).first()

    def update_post(self, post: Post) -> Post:
        self.session.add(post)
        self.session.commit()
        self.session.refresh(post)
        return post

    def delete_post(self, post: Post) -> None:
        self.session.delete(post)
        self.session.commit()

        