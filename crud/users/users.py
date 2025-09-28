from backend.schemas.db.users import DBUserCreateOut
from backend.schemas.routes.users import UserCreate


async def create_user(db: str, user: UserCreate) -> DBUserCreateOut | None:
    pass