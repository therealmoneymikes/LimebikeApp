# main.py
from contextlib import asynccontextmanager
import random
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html
from pydantic import BaseModel
from services.authz import AuthzService
from utils.redis.redis_cache import RedisClient, RedisProxy
from services.rbac_interface import RBAC
from config.config import settings
import secrets

#Routers 
from routes.bikes import router as bikerouter
from routes.me import router as merouter
from routes.users import router as userrouter

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
        spicedb_host=str(settings.get("SPICEDB_ENDPOINT", "")),
        token=str(settings.get("SPICEDB_BEARER_TOKEN_KEY", "")),
        insecure=bool(settings.get("SPICEDB_INSECURE_CONF", "")),
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
    version=str("1.0.0"),
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None
)
app.include_router(bikerouter)
app.include_router(merouter)
app.include_router(userrouter)

security = HTTPBasic()

USERNAME = "username"
PASSWORD = "superpassword"

def verify_creds(creds: HTTPBasicCredentials = Depends(security)):
    """ Verify secruity credentials for users to view api docs"""
    correct_username = secrets.compare_digest(creds.username, USERNAME)
    correct_password = secrets.compare_digest(creds.password, PASSWORD)

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentails",
            headers={"WWW-Authenticate": "Basic"}
        )
        
@app.get("/docs", include_in_schema=False)
def custom_swagger_ui(creds: HTTPBasicCredentials = Depends(verify_creds)):
    """ Custom Swagger UI Router to allow for basic authentication """
    return get_swagger_ui_html(openapi_url=app.openapi_url or "/api/v1/openapi.json", title="Limebike API Docs")

@app.get(app.openapi_url or "", include_in_schema=False)
def get_open_api_protected(creds: HTTPBasicCredentials = Depends(verify_creds)):
    """ Custom Open API hook to lock /openapi.json call to swagger UI"""
    return app.openapi()


class OTPRequest(BaseModel):
    phone_number: str
    
@app.post("/otp")
def get_otp_test(request: OTPRequest):
    
    phone = request.phone_number
    random_value = random.randint(0, 999999)
    str_random_value = f"{random_value:06}"
    print(str_random_value)
    return {"otp": str_random_value, "phone": phone}