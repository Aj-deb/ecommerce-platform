from app.core.db import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship,Mapped,mapped_column


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("productdetail.product_id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)

    author: Mapped[str] = mapped_column(nullable=False)
    rating: Mapped[int] = mapped_column(nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(nullable=False)

    helpful: Mapped[int] = mapped_column(default=0)
    not_helpful: Mapped[int] = mapped_column(default=0)

    product: Mapped["ProductDetail"] = relationship(back_populates="reviews")