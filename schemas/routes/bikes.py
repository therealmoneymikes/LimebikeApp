








from datetime import datetime
from pydantic import BaseModel

from models.bikes import BikeTypeEnum


class BikeReadOne(BaseModel):
    id: str

class Coordinates(BaseModel):
    lon: float
    lat: float

class BikeReadOneOut(BaseModel):
    id: str
    bike_type: BikeTypeEnum
    location: Coordinates
    
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }
    

class BikeReadAllOut(BaseModel):
    bikes: list[BikeReadOneOut]
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }

