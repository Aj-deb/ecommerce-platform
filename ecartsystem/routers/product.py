from fastapi import APIRouter,Depends
from schema.product_schema import ProductCreate,ProductReturn
from models.user_model import User
from models.user_model import Products
from db import get_db


router = APIRouter(prefix="/products")

@router.post('/create',response_model=ProductReturn)
async def create_product(
    product: ProductCreate,
    db  = Depends(get_db)
):
    product = Products(name=product.name,price=product.price)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product