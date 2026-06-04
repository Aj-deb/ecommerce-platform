from pydantic import BaseModel,ConfigDict

class EmailOtp(BaseModel):
    email :str
    
class Otp(EmailOtp):
    otp: str 
    model_config = ConfigDict(extra="forbid") 
    
class OtpReturn(BaseModel):
    success:bool
    message:str
    