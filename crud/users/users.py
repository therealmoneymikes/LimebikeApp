from uuid import UUID
from backend.exceptions.db_exceptions import DatabaseOperationError, EmailAlreadyExistsError, UserNotFoundError
from backend.exceptions.handlers import handle_db_exceptions
from backend.models.users import User
from backend.schemas.db.users import DBUserCreateOut, DBUserDeleteOut, DBUserReadOut, DBUserUpdateOut
from backend.schemas.routes.users import UserCreate, UserRead, UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from utils.helpers import generate_user_id, hash_password, normalize_phone_number
import bcrypt





@handle_db_exceptions("update_user")
async def update_user(db: AsyncSession, user_id: str, user_update: UserUpdate) -> DBUserUpdateOut | None:
    # Current user_id comes from JWT token in header
    
  
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise UserNotFoundError(user_id)
    
    if user_update.email != user.email:
        existing_email_result = await db.execute(select(User).where(User.email == user_update.email))
        
        if existing_email_result.scalar_one_or_none():
            raise EmailAlreadyExistsError(user_update.email)
    
    #Excludes none values (exclude_unset = True)
    update_data = user_update.model_dump(exclude_unset=True)
    
    #Handle phone number normalisation if mobile number changes
    if "phone_number" in update_data:
        update_data["phone_number_normalized"] = normalize_phone_number(update_data["phone_number"])
        
        
    await db.execute(update(User).where(User.id == user_id).values(**update_data))
    
    #Logger will be here later
    return DBUserUpdateOut.model_validate(user)



@handle_db_exceptions("delete_user")
async def delete_user(db: AsyncSession, user_id: str) -> DBUserDeleteOut | None:
    

    result = await db.execute(select(User).where(User.id == user_id))
    existing_user = result.scalar_one_or_none()
    
    if not existing_user:
        raise UserNotFoundError(user_id)
    
    await db.delete(existing_user)
    
    return DBUserDeleteOut.model_validate(existing_user)



@handle_db_exceptions("read_user")
async def get_user(db: AsyncSession, user_id: str) -> DBUserReadOut | None:

        result = await db.execute(select(User).where(User.id == user_id))
        existing_user = result.scalar_one_or_none()
        
        if not existing_user:
            raise UserNotFoundError(user_id)
        
        
        return DBUserReadOut.model_validate(existing_user)