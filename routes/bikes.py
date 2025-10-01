from typing import Literal
from fastapi import APIRouter, Query
from sqlalchemy import func

from backend.schemas.routes.bikes import BikeReadAllOut
from sqlalchemy.ext.asyncio import AsyncSession

from backend.utils.db_session_manager import DBAsyncSession




router = APIRouter(prefix="/bikes", tags=["bikes"])




# GET /available_bikes?longitude=-0.1276&latitude=51.5074&radius_meters=2000
@router.get("/available_bikes", response_model=BikeReadAllOut)
async def get_available_bikes_by_location(db: DBAsyncSession, longitude: float = Query(..., description="Longitude of user location"), latitude: float = Query(..., description="Latitude of user location"), radius_meters: int = Query(2000, description="Seach radius in meters")):
    
    point = func.ST    