from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.post import Post, Like, Share
from app.models.user import User
from app.schemas.post import PostUpdate
from app.utils.file_upload import save_image_file, delete_image_file, get_image_url
from fastapi import HTTPException
from typing import List, Optional


def _get_post_or_404(db: Session, post_id: int) -> Post:
    """Get post by ID or raise 404 if not found."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


class PostService:
    @staticmethod
    def create_post(
        db: Session, 
        user_id: int, 
        image_file, 
        caption: Optional[str] = None
    ) -> Post:
        """Create a new post with image and caption."""
        filename = save_image_file(image_file)
        
        db_post = Post(
            user_id=user_id,
            image_path=filename,
            caption=caption
        )
        
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post
    
    @staticmethod
    def get_post_by_id(db: Session, post_id: int) -> Optional[Post]:
        """Get post by ID."""
        return db.query(Post).filter(Post.id == post_id).first()
    
    @staticmethod
    def get_timeline(
        db: Session, 
        current_user_id: int,
        skip: int = 0, 
        limit: int = 20
    ) -> List[dict]:
        """Get timeline of posts with user information and like status."""
        posts = db.query(
            Post,
            User.username
        ).join(User, Post.user_id == User.id)\
         .order_by(desc(Post.created_at))\
         .offset(skip)\
         .limit(limit)\
         .all()
        
        user_likes = db.query(Like.post_id).filter(Like.user_id == current_user_id).all()
        liked_post_ids = {like.post_id for like in user_likes}
        
        timeline = []
        for post, username in posts:
            timeline.append({
                "id": post.id,
                "username": username,
                "image_url": get_image_url(post.image_path),
                "caption": post.caption,
                "likes_count": post.likes_count,
                "shares_count": post.shares_count,
                "created_at": post.created_at,
                "is_liked": post.id in liked_post_ids
            })
        
        return timeline
    
    @staticmethod
    def get_total_posts_count(db: Session) -> int:
        """Get total number of posts."""
        return db.query(Post).count()
    
    @staticmethod
    def like_post(db: Session, user_id: int, post_id: int) -> bool:
        """Like a post."""
        post = _get_post_or_404(db, post_id)
        
        existing_like = db.query(Like).filter(
            Like.user_id == user_id,
            Like.post_id == post_id
        ).first()
        
        if existing_like:
            db.delete(existing_like)
            post.likes_count = max(0, post.likes_count - 1)
            db.commit()
            return False
        else:
            new_like = Like(user_id=user_id, post_id=post_id)
            db.add(new_like)
            post.likes_count += 1
            db.commit()
            return True
    
    @staticmethod
    def share_post(db: Session, user_id: int, post_id: int) -> bool:
        """Share a post."""
        post = _get_post_or_404(db, post_id)
        
        new_share = Share(user_id=user_id, post_id=post_id)
        db.add(new_share)
        post.shares_count += 1
        db.commit()
        return True
    
    @staticmethod
    def delete_post(db: Session, user_id: int, post_id: int) -> bool:
        """Delete a post (only by the post owner)."""
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.user_id == user_id
        ).first()
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        db.query(Like).filter(Like.post_id == post_id).delete()
        db.query(Share).filter(Share.post_id == post_id).delete()
        delete_image_file(post.image_path)
        db.delete(post)
        db.commit()
        return True
    
    @staticmethod
    def update_post(
        db: Session, 
        user_id: int, 
        post_id: int, 
        post_data: PostUpdate
    ) -> Optional[Post]:
        """Update a post (only by the post owner)."""
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.user_id == user_id
        ).first()
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        if post_data.caption is not None:
            post.caption = post_data.caption
        
        db.commit()
        db.refresh(post)
        return post 