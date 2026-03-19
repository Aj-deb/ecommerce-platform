from app.core.db import Base
from sqlalchemy import Column, Integer, Numeric, String,ForeignKey,VARCHAR,Table
from sqlalchemy.orm import relationship,Mapped,mapped_column
class Inventory(Base):
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id:Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity:Mapped[int] = mapped_column(nullable=False)
    
    product:Mapped["Products"] = relationship(back_populates="inventory")

