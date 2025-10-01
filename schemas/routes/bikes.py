








from datetime import datetime
from pydantic import BaseModel

from backend.models.bikes import BikeTypeEnum


class BikeReadOne(BaseModel):
    id: str

class Coordinates(BaseModel):
    lon: float
    lat: float

class BikeReadOneOut(BaseModel):
    id: str
    bike_type: BikeTypeEnum
    location: Coordinates
    
    
    class Config:
        orm_mode = True
    

class BikeReadAllOut(BaseModel):
    bikes: list[BikeReadOneOut]
    
    class Config:
        orm_mode = True

