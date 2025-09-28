from typing import Optional
from pydantic import BaseModel







class DBUserLogin(BaseModel):
    email: str
    password: str
    
    
class DBUserLoginOut(BaseModel):
    first_name: str
    access_token: str


class DBUserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    surname: str
    address: str
    phone_number: str
    phone_number_normalized: str


class DBUserCreateOut(BaseModel):
    email: str
    first_name: str
    surname: str
    phone_number_normalized: str