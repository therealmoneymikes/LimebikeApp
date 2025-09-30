from fastapi import APIRouter

from backend.config.security.auth import GetCurrentUserDep
from backend.crud.users.users import delete_user, get_user, update_user
from backend.schemas.routes.users import UserDeleteOut, UserReadOut, UserUpdate, UserUpdateOut
from backend.utils.db_session_manager import DBAsyncSession




router = APIRouter()

# Consistency → mobile/web clients can always hit /me after auth to hydrate the session.
@router.get("/me", response_model=UserReadOut)
async def get_me(db: DBAsyncSession, current_user: GetCurrentUserDep) -> UserReadOut:
    user = await get_user(db, current_user["id"])
    return UserReadOut.model_validate(user)


@router.put("/me", response_model=UserUpdateOut)
async def update_me(data: UserUpdate, db: DBAsyncSession, current_user: GetCurrentUserDep) -> UserUpdateOut:
    user_update = await update_user(db, current_user["id"], data)
    return UserUpdateOut.model_validate(user_update)


@router.delete("/me", response_model=UserDeleteOut)
async def delete_me(db: DBAsyncSession, current_user: GetCurrentUserDep) -> UserDeleteOut:
    user_delete = await delete_user(db, current_user["id"])
    return UserDeleteOut.model_validate(user_delete)
    
