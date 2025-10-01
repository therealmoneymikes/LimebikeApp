# main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from backend.services.authz import AuthzService
from backend.utils.redis.redis_cache import RedisClient, RedisProxy
from backend.services.rbac_interface import RBAC
from config.config import settings

#Routers 
from backend.routes.bikes import router as bikerouter
from backend.routes.me import router as merouter
from backend.routes.users import router as userrouter

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Redis
    redis_client = RedisClient.get_instance()
    redis_proxy = RedisProxy(redis_client)
    
    # Test Redis connection
    try:
        await redis_proxy.ping()
        print("✓ Redis connected")
    except Exception as e:
        print(f"✗ Redis connection failed: {e}")
        raise
    
    # Initialize SpiceDB client
    authz_client = AuthzService(
        spicedb_host=str(settings.SPICEDB_ENDPOINT),
        token=str(settings.SPICEDB_BEARER_TOKEN_KEY),
        insecure=bool(settings.SPICEDB_INSECURE_CONF),
    )
    
    # Initialize RBAC interface
    rbac_interface = RBAC(authz_client)
    
    # Store in app state
    app.state.redis = redis_proxy
    app.state.authz_client = authz_client
    app.state.rbac_interface = rbac_interface
    
    print("✓ SpiceDB and Redis initialized")
    
    try:
        yield
    finally:
        # Cleanup
        try:
            # Close SpiceDB gRPC channel
            if hasattr(authz_client.client, '_channel'):
                authz_client.client._channel.close() # type: ignore[attr-defined]
            
            # Close Redis connection
            await redis_client.aclose()
            
            print("✓ SpiceDB and Redis connections closed")
        except Exception as e:
            print(f"✗ Error during cleanup: {e}")


app = FastAPI(
    version=str(settings.APP_VERSION),
    lifespan=lifespan
)
app.include_router(bikerouter)
app.include_router(merouter)
app.include_router(userrouter)