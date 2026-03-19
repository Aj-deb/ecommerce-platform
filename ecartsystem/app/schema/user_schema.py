from fastapi import HTTPException,status
from pydantic import BaseModel,ConfigDict,EmailStr,validator,model_validator
import re
PASSWORD_REGEX =r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
class UserVerify(BaseModel):
    email  : EmailStr
    password : str

class UserRegister(BaseModel):
    name:str
    email  : EmailStr
    password : str
    confirmpassword:str
    
    @validator("password")
    def valid_password(cls,v):
        if not re.fullmatch(PASSWORD_REGEX,v):
            raise ValueError("password should be greater than 8 character,one captial letter,one lower case")
        return v     
    @model_validator(mode="after")
    def confirm_pass(self):
        if self.password != self.confirmpassword:
            raise ValueError("Passwords do not match")
        return self

class UserCreate(UserVerify):
    name:str
    model_config = ConfigDict(extra="forbid")

class UserReturn(BaseModel):
    # id :int
    email:str
    role_id:int
    