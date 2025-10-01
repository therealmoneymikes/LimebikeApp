from typing import Optional
from pydantic import BaseModel
from uuid import UUID





class UserBase:
    email: str
    first_name: str
    surname: str
    phone_number: str
    password: str
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
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }


class UserRead(BaseModel):
    email: str
    password: str

class UserReadOut(BaseModel):
    # as_uuid=True means SQLAlchemy will store it as PostgreSQL uuid type but return it as a Python uuid.UUID object in your ORM model.
    id: UUID
    email: str
    first_name: str
    surname: str
    phone_number_normalized: str

class UserUpdate(BaseModel):
    email:str
    first_name:str
    surname:str
    phone_number:str
    

class UserUpdateOut(UserUpdate):
    pass
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }


class UserDelete(BaseModel):
    email: str
    
class UserDeleteOut(BaseModel):
    first_name: str
    
    model_config = {
        "from_attributes": True  # instead of orm_mode
    }
    
    