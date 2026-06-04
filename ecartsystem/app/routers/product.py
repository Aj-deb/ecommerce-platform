from typing import List, Optional

from fastapi import APIRouter,Depends,HTTPException,status
from app.schema.product_schema import ProductCreate,ProductReturn
from app.models.user_model import User
from app.models.user_model import Products,ProductDetail
from app.core.db import get_db
from app.schema.productDetail import  ProductDetailCreate, ProductDetailReturn
from app.models.inventory_model import Inventory
from sqlalchemy import or_

router = APIRouter(prefix="/products")

@router.get("/items",response_model=List[ProductReturn])
def get_products(limit:int,page:int,q: Optional[str] = None,db  = Depends(get_db)):
    query = db.query(Products)

    if q:
        words = [part for part in q.strip().split() if part][:3]
        if words:
            query = query.filter(or_(*[Products.name.ilike(f"%{word}%") for word in words]))

    products = query.offset((page-1)*limit).limit(limit).all()
    return products

@router.post('/create',response_model=ProductReturn)
async def create_product(product: ProductCreate, db  = Depends(get_db)):
    product = Products(name=product.name,price=product.price)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.get("/{product_id}/detail", response_model=ProductDetailReturn)
def get_Detail(product_id: int, db=Depends(get_db)):
    product = (
        db.query(ProductDetail)
        .join(Products)
        .join(Inventory, isouter=True)
        .filter(ProductDetail.product_id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(status_code=404, detail="Product detail not found")

    return {
        "id": product.product.id,
        "name": product.name,
        "price": product.product.price,
        "url": product.product.url,

        "description": product.description,
        "rating": product.rating,
        "rating_count": product.rating_count,

        "final_price": product.final_price,
        "discount_percentage": product.discount_percentage,

        "stock_quantity": product.inventory.quantity if product.inventory else 0,
        "sku": product.sku,

        "warranty": product.warranty,
        "return_policy": product.return_policy,

        "images": product.images,
        "specifications": product.specifications,
        "features": product.features,
        "reviews": product.reviews
    }
    
# this route for admin for registering products
@router.post("/detail")
def get_products(data:ProductDetailCreate  ,db  = Depends(get_db)):  
    # product = db.query(ProductDetail).filter(ProductDetail.product_id == data.id).first()
    data = ProductDetail(name=data.name,description=data.description,rating=data.rating,stock=data.stock,product_id = data.id)
    db.add(data)
    db.commit()
    db.refresh(data)
    return data
    
   
