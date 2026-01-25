from pydantic import BaseModel
from schema.product_schema import ProductReturn

class CartItemCreate(BaseModel):
    quantity:int
    product_id : int
    
class CartItemResponse(BaseModel):
    id:int
    cart_id :int
    quantity:int
    product :ProductReturn

class CartResponse(BaseModel):
  items:list[CartItemResponse]
