import contextlib
from dataclasses import dataclass
from typing import Annotated, Any, AsyncGenerator, AsyncIterator
from urllib.parse import quote_plus
from dynaconf import Dynaconf
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection, async_sessionmaker, create_async_engine
from backend.config import config
from types import SimpleNamespace
# contextlib.asynccontextmanager -> asynccontextmanager allows you to write a generator-like function instead of manually defining __aenter__ and __aexit__.


class DatabaseSessionManager:
    def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
        self.host = host
        # Core connection factory to your database -> asyncpg driver
        #Here is the db and how to talk to it
        self._engine = create_async_engine(host, **engine_kwargs)
        # async session factory for unit of work (session) -> (add, delete, query orm obkects) -> tracks all changes -> commit to  
        #expire_on_commit=False → prevents SQLAlchemy from expiring loaded objects after commit (so you can still access their attributes).
        #
        self._sessionmaker = async_sessionmaker(bind=self._engine, autocommit=False, expire_on_commit=False)
        
    async def close(self):
        # Close method
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        await self._engine.dispose()
            
        self._engine = None
        self._sessionmaker = None
        
    
    @contextlib.asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        # self._engine.begin() returns a context manager
        # acquires a connection from the engine pool
        # begins a transaction automatically and commits if 
        # the block exists successfully, or rolls back in an excpetion occurs
        # Lower level: Direct access to the database connection
        # Manual SQL: You write raw SQL queries
        # No ORM: No object mapping, just pure SQL
        async with self._engine.begin() as connection:
            try:
                yield connection
                
            except Exception:
                await connection.rollback()
                raise
        
    
    @contextlib.asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        # # This gets a connection FROM the pool
        #Higher level: Object-relational mapping abstraction
        #ORM operations: Work with Python objects, not SQL
        if self._sessionmaker is None:
            raise Exception("DatabaseSessionManager is not initialized")
        
        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
            

@dataclass
class DatabaseSettings:
    HOST:str
    PORT: int
    USER: str 
    PASSWORD: str
    URL: str
    NAME: str
#getattr(object, attribute_name, default_value)
database_settings = DatabaseSettings(
    HOST=str(config.settings.HOST),
    PORT=int(str(config.settings.PORT)),
    USER=str(config.settings.USER),
    PASSWORD=str(config.settings.PASSWORD),
    URL=str(config.settings.URL),
    NAME=str(config.settings.NAME),
)
port = f":{database_settings.PORT}" if database_settings.PORT else ""

password = quote_plus(database_settings.PASSWORD)
#Logger Info
#This prevents connection leaks and keeps the transaction lifecycle predictable.
sessionmanager = DatabaseSessionManager(f"postgresql+asyncpg://{database_settings.USER}:{password}@{database_settings.HOST}{port}/{database_settings.NAME}")


# When injected into FastAPI (Depends(get_db_session)), it yields a session per request and closes/rolls back properly.
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with sessionmanager.session() as session:
        yield session

# DB AsyncSession at Route Layer
DBAsyncSession = Annotated[AsyncSession, Depends(get_db_session)]