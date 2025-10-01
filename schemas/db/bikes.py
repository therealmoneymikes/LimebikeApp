from pydantic import BaseModel
from datetime import datetime
from models.bikes import BikeTypeEnum





class DBBikeCreate(BaseModel):
    id: str 
    bike_type: BikeTypeEnum

    #Pydantic will automatically parse ISO 8601 strings and serialize datetime back to JSON
    
    
    #orm_mode = True lets Pydantic convert directly from SQLAlchemy objects.
    #But when you use SQLAlchemy (or any ORM), you often return a class instance, not a dict.

class DBBikeCreateOut(BaseModel):
    id: str
    bike_type: BikeTypeEnum
    location: tuple[float, float]
    commissioned_date: datetime
    
    #Pydantic will automatically parse ISO 8601 strings and serialize datetime back to JSON
    
    
    #orm_mode = True ->  lets Pydantic convert directly from SQLAlchemy objects.
    #But when you use SQLAlchemy (or any ORM), you often return a class instance, not a dict.
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }
        

class DBBikeUpdate(BaseModel):
    id: str
    location: tuple[float, float]
    

class DBBikeUpdateOut(BaseModel):
    id: str
    location: tuple[float, float]
    bike_type: BikeTypeEnum
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }
    


class DBBikeDelete(BaseModel):
    id: str
    
class DBBikeDeleteOut(BaseModel):
    id: str
    bike_type: BikeTypeEnum
    location: tuple[float, float]
    commissioned_date: datetime
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }
    

class DBBikeReadOne(BaseModel):
    id: str

class DBBikeReadOneOut(BaseModel):
    id: str
    bike_type: BikeTypeEnum
    location: tuple[float, float]
    commissioned_date: datetime
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }
    

class DBBikeReadAllOut(BaseModel):
    bikes: list[DBBikeReadOneOut]
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }
    