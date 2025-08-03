from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.core.config import settings
from app.models.user import User
from app.schemas.post import PostResponse, TimelineResponse, PostUpdate
from app.services.post_service import PostService

router = APIRouter(prefix="/posts", tags=["posts"])


@router.post("/", response_model=PostResponse)
def create_post(
    image: UploadFile = File(...),
    caption: Optional[str] = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new post with image and caption."""
    post = PostService.create_post(db, current_user.id, image, caption)
    
    return {
        "id": post.id,
        "username": current_user.username,
        "image_url": f"/uploads/{post.image_path}",
        "caption": post.caption,
        "likes_count": post.likes_count,
        "shares_count": post.shares_count,
        "created_at": post.created_at,
        "is_liked": False
    }


@router.get("/timeline", response_model=TimelineResponse)
def get_timeline(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get timeline of posts."""
    skip = (page - 1) * per_page
    posts = PostService.get_timeline(db, current_user.id, skip, per_page)
    total = PostService.get_total_posts_count(db)
    
    return {
        "posts": posts,
        "total": total,
        "page": page,
        "per_page": per_page
    }


@router.post("/{post_id}/like")
def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Like or unlike a post."""
    is_liked = PostService.like_post(db, current_user.id, post_id)
    return {"liked": is_liked}


@router.post("/{post_id}/share")
def share_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Share a post."""
    PostService.share_post(db, current_user.id, post_id)
    return {"shared": True, "share_url": f"{settings.FRONTEND_URL}/post/{post_id}"}


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a post (only by the post owner)."""
    post = PostService.update_post(db, current_user.id, post_id, post_data)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    user = db.query(User).filter(User.id == post.user_id).first()
    
    return {
        "id": post.id,
        "username": user.username,
        "image_url": f"/uploads/{post.image_path}",
        "caption": post.caption,
        "likes_count": post.likes_count,
        "shares_count": post.shares_count,
        "created_at": post.created_at,
        "is_liked": False
    }


@router.get("/{post_id}/public")
def get_public_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Get a public post view (no authentication required)."""
    post = PostService.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    user = db.query(User).filter(User.id == post.user_id).first()
    
    return {
        "id": post.id,
        "username": user.username,
        "image_url": f"/uploads/{post.image_path}",
        "caption": post.caption,
        "likes_count": post.likes_count,
        "shares_count": post.shares_count,
        "created_at": post.created_at
    }


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a post (only by the post owner)."""
    PostService.delete_post(db, current_user.id, post_id)
    return {"message": "Post deleted successfully"} 