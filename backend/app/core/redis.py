import redis
import json
from typing import Any, Optional
from app.core.config import settings


class RedisService:
    """Redis service for caching and session management."""
    
    _instance = None
    _redis_client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RedisService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._redis_client is None:
            self._redis_client = redis.from_url(
                settings.REDIS_URL,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASSWORD,
                decode_responses=True
            )
    
    @property
    def client(self):
        """Get Redis client instance."""
        return self._redis_client
    
    def ping(self) -> bool:
        """Test Redis connection."""
        try:
            return self._redis_client.ping()
        except Exception:
            return False
    
    # Session Management
    def set_session(self, user_id: int, token: str, expires: int = 3600) -> bool:
        """Store user session with expiration."""
        try:
            self._redis_client.setex(f"session:{user_id}", expires, token)
            self._redis_client.sadd(f"active_sessions:{user_id}", token)
            return True
        except Exception:
            return False
    
    def get_session(self, user_id: int) -> Optional[str]:
        """Get user session token."""
        try:
            return self._redis_client.get(f"session:{user_id}")
        except Exception:
            return None
    
    def delete_session(self, user_id: int, token: str) -> bool:
        """Delete user session."""
        try:
            self._redis_client.delete(f"session:{user_id}")
            self._redis_client.srem(f"active_sessions:{user_id}", token)
            return True
        except Exception:
            return False
    
    def blacklist_token(self, token: str, expires: int = 3600) -> bool:
        """Add token to blacklist."""
        try:
            self._redis_client.setex(f"blacklist:{token}", expires, "1")
            return True
        except Exception:
            return False
    
    def is_token_blacklisted(self, token: str) -> bool:
        """Check if token is blacklisted."""
        try:
            return self._redis_client.exists(f"blacklist:{token}") > 0
        except Exception:
            return False
    
    # Timeline Caching
    def cache_timeline(self, user_id: int, page: int, timeline_data: list, expires: int = 300) -> bool:
        """Cache user timeline."""
        try:
            key = f"timeline:{user_id}:{page}"
            self._redis_client.setex(key, expires, json.dumps(timeline_data, default=str))
            return True
        except Exception:
            return False
    
    def get_cached_timeline(self, user_id: int, page: int) -> Optional[list]:
        """Get cached timeline."""
        try:
            key = f"timeline:{user_id}:{page}"
            data = self._redis_client.get(key)
            return json.loads(data) if data else None
        except Exception:
            return None
    
    def invalidate_timeline_cache(self, user_id: int) -> bool:
        """Invalidate all timeline cache for user."""
        try:
            pattern = f"timeline:{user_id}:*"
            keys = self._redis_client.keys(pattern)
            if keys:
                self._redis_client.delete(*keys)
            return True
        except Exception:
            return False
    
    # Like/Share Counters
    def increment_like_count(self, post_id: int) -> int:
        """Increment like count for post."""
        try:
            return self._redis_client.hincrby(f"post:{post_id}", "likes", 1)
        except Exception:
            return 0
    
    def decrement_like_count(self, post_id: int) -> int:
        """Decrement like count for post."""
        try:
            return self._redis_client.hincrby(f"post:{post_id}", "likes", -1)
        except Exception:
            return 0
    
    def increment_share_count(self, post_id: int) -> int:
        """Increment share count for post."""
        try:
            return self._redis_client.hincrby(f"post:{post_id}", "shares", 1)
        except Exception:
            return 0
    
    def get_post_counts(self, post_id: int) -> dict:
        """Get like and share counts for post."""
        try:
            counts = self._redis_client.hgetall(f"post:{post_id}")
            return {
                "likes": int(counts.get("likes", 0)),
                "shares": int(counts.get("shares", 0))
            }
        except Exception:
            return {"likes": 0, "shares": 0}
    
    def set_post_counts(self, post_id: int, likes: int, shares: int) -> bool:
        """Set like and share counts for post."""
        try:
            self._redis_client.hset(f"post:{post_id}", mapping={
                "likes": likes,
                "shares": shares
            })
            return True
        except Exception:
            return False
    
    # User Like Tracking
    def add_user_like(self, user_id: int, post_id: int) -> bool:
        """Add post to user's liked posts."""
        try:
            self._redis_client.sadd(f"user_likes:{user_id}", post_id)
            return True
        except Exception:
            return False
    
    def remove_user_like(self, user_id: int, post_id: int) -> bool:
        """Remove post from user's liked posts."""
        try:
            self._redis_client.srem(f"user_likes:{user_id}", post_id)
            return True
        except Exception:
            return False
    
    def has_user_liked(self, user_id: int, post_id: int) -> bool:
        """Check if user has liked post."""
        try:
            return self._redis_client.sismember(f"user_likes:{user_id}", post_id)
        except Exception:
            return False
    
    def get_user_liked_posts(self, user_id: int) -> set:
        """Get all posts liked by user."""
        try:
            likes = self._redis_client.smembers(f"user_likes:{user_id}")
            return {int(post_id) for post_id in likes}
        except Exception:
            return set()
    
    # User Activity Tracking
    def set_user_online(self, user_id: int, expires: int = 300) -> bool:
        """Mark user as online."""
        try:
            self._redis_client.setex(f"user_online:{user_id}", expires, "1")
            return True
        except Exception:
            return False
    
    def is_user_online(self, user_id: int) -> bool:
        """Check if user is online."""
        try:
            return self._redis_client.exists(f"user_online:{user_id}") > 0
        except Exception:
            return False
    
    # General Cache Methods
    def set_cache(self, key: str, value: Any, expires: Optional[int] = None) -> bool:
        """Set cache value."""
        try:
            if expires:
                self._redis_client.setex(key, expires, json.dumps(value, default=str))
            else:
                self._redis_client.set(key, json.dumps(value, default=str))
            return True
        except Exception:
            return False
    
    def get_cache(self, key: str) -> Any:
        """Get cache value."""
        try:
            data = self._redis_client.get(key)
            return json.loads(data) if data else None
        except Exception:
            return None
    
    def delete_cache(self, key: str) -> bool:
        """Delete cache value."""
        try:
            return self._redis_client.delete(key) > 0
        except Exception:
            return False


# Global Redis service instance
redis_service = RedisService() 