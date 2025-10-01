from uuid import UUID
from backend.exceptions.db_exceptions import DatabaseOperationError, EmailAlreadyExistsError, UserNotFoundError
from backend.exceptions.handlers import handle_db_exceptions
from backend.models.users import User
from backend.schemas.db.users import DBUserCreateOut, DBUserReadOut, DBUserUpdateOut
from backend.schemas.routes.users import UserCreate, UserRead, UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from utils.helpers import generate_user_id, hash_password, normalize_phone_number
import bcrypt




@handle_db_exceptions("create_user")
async def create_user(db: AsyncSession, user: UserCreate) -> DBUserCreateOut | None:
    """_summary_

        db (AsyncSession): AsyncSession Object for DB operations
        user (UserCreate): Pydantic Object received from the route layer

    Returns:
        DBUserCreateOut | None: Returns the resulting data from database response or returns None 
    """

    user_data = await db.execute(select(User).where(User.email == user.email))
    existing_user = user_data.scalar_one_or_none()
    if not existing_user:
        return None
    
    user_id = generate_user_id(user.email)
    user_phone_number = user.phone_number
    normalized_phone_number = normalize_phone_number(user_phone_number)
    
    hashed_password = hash_password(user.password)
    
    new_user = User(id=user_id, email=user.email, first_name=user.first_name, surname=user.surname, password=hashed_password, phone_number=user_phone_number, normalized_phone_number=normalized_phone_number)
    
    db.add(new_user)
    await db.flush()
    
    return DBUserCreateOut.model_validate(new_user)
    
@handle_db_exceptions("authenticate_user")
async def authenticate_user(db: AsyncSession, user: UserRead) -> DBUserReadOut | None:
    
    user_data = await db.execute(select(User).where(User.email == user.email))
    existing_user = user_data.scalar_one_or_none()
    if not existing_user:
        return None
    
    hashed_password = hash_password(user.password)
    password_compare = bcrypt.checkpw(user.password.encode("utf-8"), hashed_password.encode("utf-8"))
    
    if not password_compare:
        return None
    
  
    #.model_validate -> Any fields not listed in DBUserReadOut (like password, internal metadata) are automatically ignored
    return DBUserReadOut.model_validate(existing_user)
