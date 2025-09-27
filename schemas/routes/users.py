from typing import Optional
from pydantic import BaseModel






class UserBase:
    email: str
    first_name: str
    surname: str
    phone_number: str
class UserCreate(UserBase):
    pass


## To fire SES event in kafka
## Best pattern is a transaction outbox + outbox table to avoid dual write problem 
# Event publishing is decoupled → if Kafka is down, user signup still succeeds, event just retries later

class UserCreateOut(BaseModel):
    email: str
    first_name: str
    surname: str
    phone_number: str
    
    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    email: Optional[str]
    first_name: Optional[str]
    surname: Optional[str]
    phone_number: Optional[str]
    

class UserUpdateOut(UserUpdate):
    pass
    class Config:
            orm_mode = True


class UserDelete(BaseModel):
    email: str
    
class UserDeleteOut(BaseModel):
    first_name: str
    
    class Config:
        orm_mode = True
    
    