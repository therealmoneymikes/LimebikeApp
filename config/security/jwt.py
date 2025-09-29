from fastapi import HTTPException, Header, status
from jose import jwt, jwk, jws
from datetime import datetime, timedelta, timezone

import os
from config.config import settings


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
EXPIRY_MINUTES = settings.ACCESS_TOKEN_EXPIRY_MINUTES

def create_jwt(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=float(str(EXPIRY_MINUTES))))
    
    
    token = jwt.encode(to_encode, str(SECRET_KEY), algorithm=str(ALGORITHM))
    
    #Update
    to_encode.update({"exp": expire})
    return token 


def decode_jwt(token: str):
    try:
        return jwt.decode(token, str(SECRET_KEY), algorithms=[str(ALGORITHM)])
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
# Passed to decode_and_verify_cognito_jwt
# Encoded in Base64Url, so it’s safe to put in headers or URLs.
# Usually used in Authorization: Bearer <jwt> headers.
async def get_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing Bearer token")
    return authorization.split(" ")[1]


