from pydantic import BaseModel, ConfigDict
from app.schema.product_schema import ProductReturn
from typing import Optional

class CartItemCreate(BaseModel):
    guest_cart_id :str
    product_id : int 
    quantity: int 
    
class Cartupdate(BaseModel):
    guest_cart_id:Optional[str] = None
    product_id : int
    quantity:int
    model_config = ConfigDict(extra="forbid") 
    
class guestCartId(BaseModel):
    guest_cart_id :str
    
class CartItemResponse(BaseModel):
    id:int
    # cart_id :int
    quantity:int
    product :ProductReturn
    
class CartDelete(BaseModel):
    product_id :int

class CartDeleteReturn(BaseModel):
    success:bool
    msg : str
    
class CartResponse(BaseModel):
    cart_id:int
    items:list[CartItemResponse]
