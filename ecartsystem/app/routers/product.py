from typing import List

from fastapi import APIRouter,Depends,HTTPException,status
from app.schema.product_schema import ProductCreate,ProductReturn
from app.models.user_model import User
from app.models.user_model import Products
from app.core.db import get_db

router = APIRouter(prefix="/products")

@router.get("/items",response_model=List[ProductReturn])
def get_products(limit:int,page:int,db  = Depends(get_db)):
    products = db.query(Products).offset((page-1)*limit).limit(limit).all()
    return products

@router.post('/create',response_model=ProductReturn)
async def create_product(product: ProductCreate, db  = Depends(get_db)):
    product = Products(name=product.name,price=product.price)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

# @router.get("/items",response_model=list[ProductReturn])
# def get_products(db  = Depends(get_db)):  
#     products = db.query(Products).all()
#     if products is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="no product")
#     return products

