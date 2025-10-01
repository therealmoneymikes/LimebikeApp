from fastapi import FastAPI, HTTPException, APIRouter, Header, status
from backend.config.security.auth import GetCurrentUserDep
from backend.crud.users.users import get_user
from backend.schemas.routes.users import UserReadOut
from jose import jwt
from backend.services.dependencies import RBAC
from utils.db_session_manager import DBAsyncSession
from services.dependencies import RBAC_INTERFACE

router = APIRouter(prefix="/users", tags=["users"])



@router.get("/{user_id}", response_model=UserReadOut)
async def get_user_by_id(db: DBAsyncSession, current_user: GetCurrentUserDep, user_id: str) -> UserReadOut:
    
    if not RBAC_INTERFACE.permit(user_id, permission="read", resource_type="profile", resource_id=f"{user_id}"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User {user_id} is not authorised to carry this action")
    
    if current_user["id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this user")

    db_user = await get_user(db=db, user_id=user_id)
    user = UserReadOut.model_validate(db_user)
    return user



