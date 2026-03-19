from pydantic import BaseModel
from app.schema.product_schema import ProductReturn
from typing import Optional

class CartItemCreate(BaseModel):
    quantity:int = 1
    product_id : int 
    
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
    quantity:int
    
class CartResponse(BaseModel):
    cart_id:int
    items:list[CartItemResponse]
