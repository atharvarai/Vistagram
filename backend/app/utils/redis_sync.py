from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.redis import redis_service
from app.models.post import Post, Like, Share
from app.models.user import User


def sync_post_counters_to_redis(db: Session):
    """Sync post like/share counters from database to Redis."""
    posts = db.query(Post).all()
    synced_count = 0
    
    for post in posts:
        redis_service.set_post_counts(post.id, post.likes_count, post.shares_count)
        synced_count += 1
    
    print(f"✅ Synced {synced_count} post counters to Redis")
    return synced_count


def sync_user_likes_to_redis(db: Session):
    """Sync user likes from database to Redis."""
    likes = db.query(Like).all()
    synced_count = 0
    
    for like in likes:
        redis_service.add_user_like(like.user_id, like.post_id)
        synced_count += 1
    
    print(f"✅ Synced {synced_count} user likes to Redis")
    return synced_count


def sync_all_data_to_redis():
    """Sync all relevant data from database to Redis."""
    db = next(get_db())
    
    try:
        print("🔄 Starting Redis sync...")
        
        # Sync post counters
        post_count = sync_post_counters_to_redis(db)
        
        # Sync user likes
        likes_count = sync_user_likes_to_redis(db)
        
        print(f"✅ Redis sync completed! Posts: {post_count}, Likes: {likes_count}")
        return True
        
    except Exception as e:
        print(f"❌ Redis sync failed: {e}")
        return False
    finally:
        db.close()


if __name__ == "__main__":
    sync_all_data_to_redis() 