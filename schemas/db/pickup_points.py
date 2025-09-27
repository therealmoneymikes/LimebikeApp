from pydantic import BaseModel







class DBPickUpPoint(BaseModel):
    id: str
    name: str
    capacity: int
    location: tuple[float, float]


class DBPickUpPointOut(BaseModel):
    name: str
    location: tuple[float, float]
    
    class Config:
        orm_mode = True
        

class DBPickUpPointDelete(BaseModel):
    id: str
    
class PickUpPointDeleteOut(DBPickUpPoint):
    pass
