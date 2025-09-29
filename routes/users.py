from fastapi import FastAPI, HTTPException, APIRouter, Header, status
from backend.config.security.auth import GetCurrentUserDep
from backend.crud.users.users import get_user
from backend.schemas.routes.users import UserReadOut
from jose import jwt
from utils.db_session_manager import DBAsyncSession


router = APIRouter(prefix="/users", tags=["users"])



@router.get("/{user_id}", response_model=UserReadOut)
async def get_user_by_id(db: DBAsyncSession, current_user: GetCurrentUserDep, user_id: str) -> UserReadOut:
    
    if current_user["id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this user")

    db_user = await get_user(db=db, user_id=user_id)
    user = UserReadOut.model_validate(db_user)
    return user


