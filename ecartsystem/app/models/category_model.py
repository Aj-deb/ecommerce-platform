from typing import List
from app.core.db import Base
from sqlalchemy import Column, Integer, Numeric, String,ForeignKey,VARCHAR,Table
from sqlalchemy.orm import relationship,Mapped,mapped_column

class Category(Base):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(primary_key=True)
    name:Mapped[str] = mapped_column(nullable=False)
    parent_id:Mapped[int] = mapped_column(ForeignKey("category.id"),nullable=True)
    
    products: Mapped[List["Products"]] = relationship(back_populates = "category")


