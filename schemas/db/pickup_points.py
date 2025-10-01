from pydantic import BaseModel







class DBPickUpPoint(BaseModel):
    id: str
    name: str
    capacity: int
    location: tuple[float, float]


class DBPickUpPointOut(BaseModel):
    name: str
    location: tuple[float, float]
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }
        

class DBPickUpPointDelete(BaseModel):
    id: str
    
class PickUpPointDeleteOut(DBPickUpPoint):
    pass

    model_config = {
        "from_attributes": True  # instead of orm_mode
    }