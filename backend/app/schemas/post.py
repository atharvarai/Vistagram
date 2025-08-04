from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PostBase(BaseModel):
    caption: Optional[str] = None


class PostUpdate(PostBase):
    pass


class Post(PostBase):
    id: int
    user_id: int
    image_path: str
    likes_count: int
    shares_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class PostResponse(BaseModel):
    id: int
    username: str
    image_url: str
    caption: Optional[str] = None
    likes_count: int
    shares_count: int
    created_at: datetime
    is_liked: bool = False


class TimelineResponse(BaseModel):
    posts: List[PostResponse]
    total: int
    page: int
    per_page: int 