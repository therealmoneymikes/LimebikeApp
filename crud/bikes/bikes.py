from sqlalchemy import func, select
from backend.exceptions.handlers import handle_db_exceptions
from backend.utils.db_route_dependencies import AsyncDBSession
from models.bikes import Bike
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.db.bikes import DBBikeReadAllOut, DBBikeReadOne, DBBikeReadOneOut













@handle_db_exceptions("get_available_bikes")
async def get_available_bikes(db: AsyncSession, longitude: float, latitude: float, radius_meters: int) -> DBBikeReadAllOut:
    """
    DB operation that retrieves available bikes for
    users location
    
    Args:
        db (AsyncSession): Async Session object for DB operation
        longitude (float): Longitude position
        latitude (float):  Latitude position
        radius_meters (int): Search radius for bikes in meters

    Returns:
        DBBikeReadAllOut: Sequence of available bikes within radius meters
    """
    point = func.ST_SetSRID(func.ST_MakePoint(longitude, latitude), 4326)
    result = await db.execute(select(Bike).where(func.ST_DWithin(Bike.location, point, radius_meters)))
    
    # Bikes returns a Sequence type read-only of data
    bikes = result.scalars().all()
   
    return DBBikeReadAllOut.model_validate(bikes)

@handle_db_exceptions("get_available_bikes")
async def get_available_bike(db: AsyncSession, bike: DBBikeReadOne) -> DBBikeReadOneOut | None:
    """
    DB operation that retrieve a bike by id (Admin Only)

    Args:
        db (AsyncSession): Async Session object for DB operation
        bike (DBBikeReadOne): Data Transfer Object to receive bike ID

    Returns:
        DBBikeReadOneOut: Data Transfer Object retrieve bike information
    """
    result = await db.get(Bike, bike.id)
    
    return DBBikeReadOneOut.model_validate(result) if result else None