from pydantic import BaseModel,ConfigDict
from app.enums.address_type import AddressType
class AddressCreate(BaseModel):
    first_name:str
    second_name:str
    city:str
    state:str
    house_no:str
    street_no:int
    landmark:str
    location:str
    phone_no:str    
    is_default:bool
    address_type:AddressType
    user_id:int
    
    model_config = ConfigDict(extra='forbid')
class AddressInfo(BaseModel):
    id:int
    city:str
    state:str
    house_no:str
    street_no:int
    landmark:str
    location:str
    phone_no:str
    is_default:bool
    address_type:AddressType
    
class AddressReturn(BaseModel):
    Info : list[AddressInfo]

    