from __future__ import annotations
from db import Base
from sqlalchemy import Column, Integer, String,ForeignKey,VARCHAR,Table
from sqlalchemy.orm import relationship,Mapped,mapped_column
from typing import List
from models.orders_model import Order,Orderitems

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column()
    password: Mapped[str] = mapped_column(VARCHAR(500))
    
    role_id: Mapped[str] = mapped_column(ForeignKey("roles.id"),default=1)
    
    role :Mapped["Roles"] = relationship(back_populates="users") 
    
    cart: Mapped["Cart"] = relationship(back_populates="user",uselist =False)
    
    orders :Mapped[list["Order"]] = relationship(back_populates = "users") 
    
class Cart(Base):
    __tablename__ = "cart"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"),unique=True)

    user: Mapped["User"] = relationship(back_populates="cart")
    cart_items: Mapped[list["Cartitems"]] = relationship(back_populates="cart")


class Cartitems(Base):
    __tablename__ = "cartitems"

    id: Mapped[int] = mapped_column(primary_key=True)
    cart_id: Mapped[int] = mapped_column(ForeignKey("cart.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity : Mapped[int] = mapped_column()
    price : Mapped[int] = mapped_column()

    cart: Mapped["Cart"] = relationship(back_populates="cart_items")

    product: Mapped["Products"] = relationship(back_populates="cart_items")

class Products(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()   
    price: Mapped[int] = mapped_column()

    orderitems : Mapped[list["Orderitems"]] = relationship("Orderitems",back_populates="product" )

    cart_items: Mapped[list["Cartitems"]] = relationship(back_populates="product" )


