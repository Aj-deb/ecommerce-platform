from pydantic import BaseModel
from decimal import Decimal
from pydantic import BaseModel
class ProductImageOut(BaseModel):
    image_url: str

    class Config:
        from_attributes = True


class ProductSpecificationOut(BaseModel):
    name: str
    value: str

    class Config:
        from_attributes = True


class ProductFeatureOut(BaseModel):
    feature: str

    class Config:
        from_attributes = True

class ProductDetailCreate(BaseModel):
    id :int
    name : str
    description :str
    rating : float
    quantity : int
    
    class Config:
        from_attributes = True
class ReviewOut(BaseModel):
    id: int
    author: str
    rating: int
    title: str
    comment: str
    helpful: int
    not_helpful: int

    class Config:
        from_attributes = True

      
class ProductDetailReturn(BaseModel):
    id: int
    name: str
    price: Decimal
    url: str

    description: str
    rating: Decimal
    rating_count: int

    final_price: Decimal
    discount_percentage: int

    stock_quantity: int
    sku: str

    warranty: str | None
    return_policy: str | None

    images: list[ProductImageOut]
    specifications: list[ProductSpecificationOut]
    features: list[ProductFeatureOut]
    reviews: list[ReviewOut]

    class Config:
        from_attributes = True

