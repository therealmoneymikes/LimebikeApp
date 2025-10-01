from typing import Literal
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func

from backend.config.security.auth import GetCurrentUserDep
from backend.crud.bikes.bikes import get_available_bike, get_available_bikes
from backend.schemas.db.bikes import DBBikeReadOne
from backend.schemas.routes.bikes import BikeReadAllOut, BikeReadOneOut
from sqlalchemy.ext.asyncio import AsyncSession

from backend.services.dependencies import RBAC_INTERFACE
from backend.utils.db_session_manager import DBAsyncSession
from config.security.auth import get_current_user



router = APIRouter(prefix="/bikes", tags=["bikes"])


@router.get("/available_bikes", response_model=BikeReadAllOut)
async def get_available_bikes_by_location(db: DBAsyncSession, longitude: float = Query(..., description="Longitude of user location"), latitude: float = Query(..., description="Latitude of user location"), radius_meters: int = Query(2000, description="Seach radius in meters"), current_user: dict = Depends(get_current_user)) -> BikeReadAllOut:
    """Route handles fetching all available bikes within a set radius based on 
       a users coordinates

    Args:
        db (DBAsyncSession): _description_
        longitude (float, optional): _description_. Defaults to Query(..., description="Longitude of user location").
        latitude (float, optional): _description_. Defaults to Query(..., description="Latitude of user location").
        radius_meters (int, optional): _description_. Defaults to Query(2000, description="Seach radius in meters").
        current_user (dict, optional): _description_. Defaults to Depends(get_current_user).

    Returns:
        BikeReadAllOut: Response object that contains a list of all available bikes within a set radius
    """
    

    
    user_id = current_user["id"]
    # resource_type/object_type = Represents the kind of entity the permission applies to, e.g "bike", "profile", "pickup_point"
    # resource_id/object_id = Specfic instances of the resource e.g bike-123 = Bike with ID 123
    # resource_id="" or None means all resources
    # permission (sometimes called relation) = Represents the action the user is allowed to perform
    # "read" -> can view, "write" - can edit, "manager" -> a role relationship.
    
    if not RBAC_INTERFACE.permit(user_id=user_id, permission="read-bikes", resource_type="bikes", resource_id=""):
        HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"{user_id} cannot perform this operation")
    
    available_bikes = await get_available_bikes(db, longitude, latitude, radius_meters)
    
    return BikeReadAllOut.model_validate(available_bikes)
    

@router.get("/available_bike/{bike_id}", response_model=BikeReadOneOut)
async def get_available_bike_by_id(db: DBAsyncSession, bike_id: str, current_user: dict = Depends(get_current_user)) -> BikeReadOneOut | None:
    

    user_id = current_user["id"]
    if not RBAC_INTERFACE.permit(user_id=user_id, permission="read-bike", resource_type="bikes", resource_id=""):
        HTTPException(status_code=403, detail=f"{user_id} cannot perform this action")
        
        available_bike = await get_available_bike(db, DBBikeReadOne(id=bike_id))
        
        return BikeReadOneOut.model_validate(available_bike) if available_bike else None