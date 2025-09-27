from pydantic import BaseModel







class PickUpPoint(BaseModel):
    id: str
    name: str
    capacity: int
    location: tuple[float, float]


class PickUpPointOut(BaseModel):
    name: str
    location: tuple[float, float]
    
    class Config:
        orm_mode = True
        

class PickUpPointDelete(BaseModel):
    id: str
    
class PickUpPointDeleteOut(PickUpPoint):
    pass
