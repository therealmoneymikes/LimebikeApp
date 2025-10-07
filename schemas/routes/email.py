from pydantic import BaseModel, EmailStr


class OTPEmail(BaseModel):
    email: EmailStr
    
    
class OTPEmailOut(BaseModel):
    otp: str
    
    
class EmailRequest(BaseModel):
    to: EmailStr
