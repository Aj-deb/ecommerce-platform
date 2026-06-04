from __future__ import annotations  
from fastapi import FastAPI
from sqlalchemy import Enum
from sqlalchemy.orm import relationship,Mapped,mapped_column
from sqlalchemy import ForeignKey
from db import Base
from typing import List,Text,TYPE_CHECKING
from schema.order_schema import OrderStatus

if TYPE_CHECKING:
    from .user_model import User,Products
    
class Order(Base):
    __tablename__ = "orders"
    id:Mapped[int] =mapped_column(primary_key=True)
    user_id :Mapped[int] =mapped_column(ForeignKey("users.id"))
    
    status:Mapped[int] = mapped_column(Enum(OrderStatus),default = "pending")
    
    users : Mapped["User"] = relationship(back_populates = "orders")
    
    orderitems:Mapped[list["Orderitems"]] = relationship("Orderitems",back_populates = "orders")

class Orderitems(Base):
    __tablename__ = "orderitems"
    id:Mapped[int] =mapped_column(primary_key=True)
    price:Mapped[int] = mapped_column()
    quantity :Mapped[int] = mapped_column()
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))

    order_id:Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product:Mapped["Products"] = relationship("Products",back_populates = "orderitems")

    orders:Mapped["Order"] = relationship("Order",back_populates = "orderitems")
    
