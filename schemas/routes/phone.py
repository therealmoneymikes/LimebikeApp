






from pydantic import BaseModel


class OTPRequest(BaseModel):
    phone_number: str

class OTPRequestOut(BaseModel):
    otp_code: str
    

