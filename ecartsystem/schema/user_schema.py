    
from pydantic import BaseModel,ConfigDict,EmailStr,validator
import re
PASSWORD_REGEX =r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
class UserVerify(BaseModel):
    email  : EmailStr
    password : str
    
    model_config = ConfigDict(extra="forbid")
    
    @validator("password")
    def valid_password(cls,v):
        if not re.fullmatch(PASSWORD_REGEX,v):
            raise ValueError("password should be greater than 8 character,one captial letter,one lower case")
        return v     
           
class UserCreate(UserVerify):
    name:str
    
class UserReturn(BaseModel):
    # id :int
    email:str
    role_id:int
    