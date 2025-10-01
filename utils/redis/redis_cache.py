# Use aioredis for async operations (fits FastAPI and async DB CRUD calls).
# redis_cache.py
import redis.asyncio as redis
from redis.exceptions import ConnectionError, TimeoutError
from typing import Any
import json
import logging
from config.config import settings
from redis.typing import ResponseT

logger = logging.getLogger(__name__)

REDIS_URL = settings.get("REDIS_URL", "redis://localhost:6379/0")
class RedisClient:
    """
    Singleton Redis Client
    - Ensures a single Redis connection pool is shared across your app
    """
    _instance: redis.Redis | None = None
    
    @classmethod
    def get_instance(cls) -> redis.Redis:
        if cls._instance is None:
            cls._instance = redis.from_url(
                REDIS_URL,
                decode_responses=True,
                max_connections=20, 
                socket_connect_timeout=5,
                socket_timeout=5,
            )
        return cls._instance
    
    @classmethod
    async def close_instance(cls) -> None:
        """Close the singleton instance if it exists."""
        if cls._instance is not None:
            await cls._instance.aclose()
            cls._instance = None


class RedisProxy:
    """ 
    Redis wrapper for structured access.
    Handles JSON serialization, TTL, namespaces, retries.
    """
    
    def __init__(self, client: redis.Redis):
        self.client = client
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        exp_secs: int | None = None, 
        namespace: str = "app"
    ) -> None:
        """
        Set a key-value pair in Redis.

        Args:
            key: Data key of subject object
            value: Value of subject 
            exp_secs: The time-to-live (TTL) of the key-value pair
            namespace: Domain namespace
        """
        full_key = f"{namespace}:{key}"
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            await self.client.set(full_key, value, ex=exp_secs)
        except (ConnectionError, TimeoutError) as e:
            logger.error(f"Redis SET operation failed for key {full_key}: {e}")
            raise
    
    async def get(self, key: str, namespace: str = "app") -> Any | None:
        """Get operation to retrieve a value by key."""
        full_key = f"{namespace}:{key}"
        
        try: 
            value = await self.client.get(full_key)
            if value is None:
                return None
            
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        
        except (ConnectionError, TimeoutError) as e:
            logger.error(f"Redis GET failed for key {full_key}: {e}")
            return None
    
    async def delete(self, key: str, namespace: str = "app") -> None:
        """
        Delete operation to remove a value by its key.

        Args:
            key: Key for data
            namespace: Domain namespace
        """
        full_key = f"{namespace}:{key}"
        try:
            await self.client.delete(full_key)
        except (ConnectionError, TimeoutError) as e:
            logger.error(f"Redis DELETE operation failed for key {full_key}: {e}")
            raise
    
    async def exists(self, key: str, namespace: str = "app") -> bool:
        """Check if a key exists."""
        full_key = f"{namespace}:{key}"
        
        try:
            return await self.client.exists(full_key) > 0
        
        except (ConnectionError, TimeoutError) as e:
            logger.error(f"Redis EXISTS failed for key {full_key}: {e}")
            return False
        
        
    async def ping(self) -> ResponseT:
        return await self.client.ping()