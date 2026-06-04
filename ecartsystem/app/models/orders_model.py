from __future__ import annotations  
from sqlalchemy import Enum
from decimal import Decimal
from sqlalchemy import DateTime
from datetime import datetime
from sqlalchemy.orm import relationship,Mapped,mapped_column
from sqlalchemy import ForeignKey,Numeric,Index
from app.core.db import Base
from typing import List,Text,TYPE_CHECKING
from app.schema.order_schema import OrderStatus
from sqlalchemy.sql import func

if TYPE_CHECKING:
    from .user_model import User,Products
    
class Order(Base):
    __tablename__ = "orders"
    id:Mapped[int] =mapped_column(primary_key=True)
    user_id :Mapped[int] =mapped_column(ForeignKey("users.id"),nullable=False)
    status:Mapped["OrderStatus"] = mapped_column(Enum(OrderStatus),default = OrderStatus.PENDING,nullable=False)
    created_at :Mapped[datetime] =mapped_column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    total_amount :Mapped[Decimal] = mapped_column(Numeric(10,2),nullable=False)
    
    user : Mapped["User"] = relationship(back_populates = "orders")
    
    orderitems:Mapped[List["Orderitems"]] = relationship("Orderitems",back_populates = "order")
    __table_args__=(
        Index("idx_orders_user","id","user_id"),
    )
    

class Orderitems(Base):
    __tablename__ = "orderitems"
    id:Mapped[int] =mapped_column(primary_key=True)
    price:Mapped[Decimal] = mapped_column(Numeric(10,2),nullable=False)
    quantity :Mapped[int] = mapped_column(nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"),nullable=False)
    order_id:Mapped[int] = mapped_column(ForeignKey("orders.id"),nullable=False)
    product:Mapped["Products"] = relationship("Products",back_populates = "orderitems")

    order :Mapped["Order"] = relationship("Order",back_populates = "orderitems")
    
    __table_args__= (
        Index("idx_products","product_id"), #product analutics ke liye
    )
