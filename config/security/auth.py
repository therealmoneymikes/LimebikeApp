from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jose
import httpx
from jose import jwt


# --- Cognito settings ---
COGNITO_REGION = "eu-west-1"
USER_POOL_ID = "" # replace with your pool id
APP_CLIENT_ID = "" # Cognito App Client ID
JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"

# --- HTTP Bearer token --- 
bearer_scheme = HTTPBearer()

# --- fetch JWKS once at startup
jwks = httpx.get(JWKS_URL).json()

def get_signing_key(kid: str):
    key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
    if not key:
        raise HTTPException(status_code=401, detail="Public key not found in JWKS")
    return key

AuthCredentials = Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)]

def get_current_user(credentials: AuthCredentials):
    token = credentials.credentials
    try:
        headers = jwt.get_unverified_headers(token)
        key = get_signing_key(headers["kid"])

        claims = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,
            issuer=f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}",
        )

        # Optional: check token_use
        if claims.get("token_use") != "id":
            raise HTTPException(status_code=401, detail="Invalid token use")

        # `sub` is the canonical user ID
        current_user = {
            "id": claims["sub"],
            "email": claims.get("email"),
            "claims": claims
        }
        return current_user

    except jose.exceptions.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jose.exceptions.JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token invalid: {str(e)}")
    
    
GetCurrentUserDep = Annotated[dict, Depends(get_current_user)]