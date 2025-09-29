





from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection

from utils.db_session_manager import get_db_session 

AsyncDBSession = Annotated[AsyncSession, Depends(get_db_session)]