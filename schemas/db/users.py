from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr







class DBUserRead(BaseModel):
    email: str
    password: str
    
    
class DBUserReadOut(BaseModel):
    id: UUID
    first_name: str
    surname: str
    email: str
    phone_number: str
    
    class Config:
        orm_mode = True


class DBUserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    surname: str
    address: str
    phone_number: str
    phone_number_normalized: str


class DBUserCreateOut(BaseModel):
    id: UUID
    email: str
    first_name: str
    surname: str
    phone_number_normalized: str
    
    class Config:
        orm_mode = True


class DBUserUpdate(BaseModel):
    # No ID here - comes from URL path
    # No password here - seperate endpoint for password changes
    email: EmailStr
    first_name: str
    surname: str
    address: str
    phone_number: str
   
    
class DBUserUpdateOut(BaseModel):
    id: UUID
    first_name: str | None
    surname: str | None
    email: str | None
    phone_number: str | None
    
    class Config:
        orm_mode = True
        
        
class DBUserDeleteOut(BaseModel):
    id: UUID 
    first_name: str
    surname: str
    email: str
    phone_number: str