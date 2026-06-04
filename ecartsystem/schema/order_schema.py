from pydantic import BaseModel
from schema.product_schema import ProductReturn
from enum import Enum

class OrderStatus(str,Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    CANCELLED = "CANCELLED"
    
class OrderCreate(BaseModel):
    user_id :int
    status:OrderStatus = OrderStatus.PENDING
    
class OrderItemResponse(BaseModel):
    quantity:int
    name:str
    price:int

class OrderResponse(BaseModel):
    # id:int
    status:OrderStatus
    order_id:int
    orderitems : list[OrderItemResponse]
    
class OrdersResponse(BaseModel):
    order_id:int
    status:str
    