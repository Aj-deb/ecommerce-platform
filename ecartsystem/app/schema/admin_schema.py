from pydantic import BaseModel, Field
from typing import List, Optional

from app.schema.order_schema import OrderStatus


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminOrderStatusUpdate(BaseModel):
    status: OrderStatus


class AdminOrderItemUpsert(BaseModel):
    id: Optional[int] = None
    product_id: int
    quantity: int = Field(ge=1)


class AdminOrderItemsUpdate(BaseModel):
    items: List[AdminOrderItemUpsert]


class AdminCartItemUpsert(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class AdminCartUpdate(BaseModel):
    items: List[AdminCartItemUpsert]

