from __future__ import annotations
from app.core.db import Base
from sqlalchemy import ForeignKey,VARCHAR,Enum
from sqlalchemy.orm import relationship,Mapped,mapped_column
from app.models.user_model import User
from app.enums.address_type import AddressType


class Address(Base):
    __tablename__ = "address"

    id: Mapped[int] = mapped_column(primary_key=True)
    city: Mapped[str] = mapped_column(nullable=False)
    first_name: Mapped[str] = mapped_column(nullable=False)
    second_name: Mapped[str] = mapped_column(nullable=False)
    state: Mapped[str] = mapped_column(nullable=False)
    house_no: Mapped[str] = mapped_column(nullable=False)
    phone_no: Mapped[str] = mapped_column(nullable=False)
    street_no: Mapped[int] = mapped_column(nullable=False)
    address_type:Mapped[str] = mapped_column(Enum(AddressType),nullable=False)
    landmark: Mapped[str] = mapped_column(nullable=True)
    location: Mapped[str] = mapped_column(nullable=False)
    is_default:Mapped[bool] = mapped_column(default=False)
    user_id :Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    user :Mapped["User"] = relationship("User",back_populates="addresses")   