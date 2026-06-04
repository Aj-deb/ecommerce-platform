from __future__ import annotations
from decimal import Decimal
from app.core.db import Base
from sqlalchemy import Column, Integer, Numeric, String,ForeignKey,VARCHAR,Table
from sqlalchemy.orm import relationship,Mapped,mapped_column
from typing import List
from app.models.inventory_model import Inventory
from app.models.category_model import Category
from app.models.orders_model import Order,Orderitems
from app.models.review import Review
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column()
    password: Mapped[str] = mapped_column(VARCHAR(500))
    role_id: Mapped[str] = mapped_column(ForeignKey("roles.id"),default=1)
    
    role :Mapped["Roles"] = relationship(back_populates="users") 
    cart: Mapped["Cart"] = relationship(back_populates="user",uselist =False)
    orders :Mapped[list["Order"]] = relationship(back_populates = "user") 
    
    addresses :Mapped[List["Address"]] = relationship("Address",back_populates="user")   
    
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

# class Products(Base):
#     __tablename__ = "products"
    
#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(nullable=False)   
#     price: Mapped[Decimal] = mapped_column(Numeric(10,2),nullable=False)
#     category_id :Mapped[int] = mapped_column(ForeignKey("category.id"),nullable=False)
#     url: Mapped[str] = mapped_column(nullable=False)
#     category :Mapped["Category"] = relationship(back_populates="products")
#     orderitems : Mapped[list["Orderitems"]] = relationship("Orderitems",back_populates="product" )
#     cart_items: Mapped[list["Cartitems"]] = relationship(back_populates="product")
    
#     product_info : Mapped["ProductDetail"] =relationship(back_populates="product")
class Products(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"), nullable=False)
    url: Mapped[str] = mapped_column(nullable=False)

    category: Mapped["Category"] = relationship(back_populates="products")
    orderitems: Mapped[list["Orderitems"]] = relationship("Orderitems", back_populates="product")
    cart_items: Mapped[list["Cartitems"]] = relationship(back_populates="product")

    product_info: Mapped["ProductDetail"] = relationship(back_populates="product", uselist=False)
    
class ProductDetail(Base):
    __tablename__ = "productdetail"

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), primary_key=True, unique=True)

    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    rating: Mapped[Decimal] = mapped_column(Numeric(2, 1), nullable=False, default=0.0)
    rating_count: Mapped[int] = mapped_column(default=0)

    final_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    discount_percentage: Mapped[int] = mapped_column(default=0)

    stock_quantity: Mapped[int] = mapped_column(default=0)
    sku: Mapped[str] = mapped_column(nullable=False, unique=True)

    warranty: Mapped[str] = mapped_column(nullable=True)
    return_policy: Mapped[str] = mapped_column(nullable=True)

    product: Mapped["Products"] = relationship(back_populates="product_info", uselist=False)
    inventory: Mapped["Inventory"] = relationship(back_populates="product_info")

    images: Mapped[list["ProductImage"]] = relationship(back_populates="product")
    specifications: Mapped[list["ProductSpecification"]] = relationship(back_populates="product")
    features: Mapped[list["ProductFeature"]] = relationship(back_populates="product")
    reviews: Mapped[list["Review"]] = relationship(back_populates="product")

class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("productdetail.product_id"), nullable=False)
    image_url: Mapped[str] = mapped_column(nullable=False)

    product: Mapped["ProductDetail"] = relationship(back_populates="images")
    
class ProductSpecification(Base):
    __tablename__ = "product_specifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("productdetail.product_id"), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    value: Mapped[str] = mapped_column(nullable=False)

    product: Mapped["ProductDetail"] = relationship(back_populates="specifications")

class ProductFeature(Base):
    __tablename__ = "product_features"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("productdetail.product_id"), nullable=False)
    feature: Mapped[str] = mapped_column(nullable=False)

    product: Mapped["ProductDetail"] = relationship(back_populates="features")