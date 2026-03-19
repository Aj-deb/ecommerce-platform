from pydantic import BaseModel
from app.schema.product_schema import ProductReturn
from enum import Enum

class OrderStatus(str,Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    CANCELLED = "CANCELLED"
    
class OrderCreate(BaseModel):
    # user_id :int
    status:OrderStatus = OrderStatus.PENDING
    
class OrderItemResponse(BaseModel):
    id:int
    quantity:int
    name:str
    price:int

class OrderResponse(BaseModel):
    status:OrderStatus
    order_id:int
    orderitems : list[OrderItemResponse]

class OrderItem(BaseModel):
    order_id :int
    
class OrdersResponse(BaseModel):
    order_id:int
    status:str
    
    