from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends




oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_token(token: str = Depends(oauth2_scheme)):
    return token 