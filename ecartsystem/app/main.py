from fastapi import FastAPI , Depends
from app.core.db import Base , get_db , engine
from app.routers import users , product ,carts,order,address, admin
# from security import router as dashboard_router
from app.seeds.seed import create_on_startup
from app.seeds.prod_seed import seed_product_details, seed_product_features, seed_product_images, seed_product_specifications, seed_products, seed_reviews
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.models import Address
from dotenv import load_dotenv
from app.seeds.category_seed import seed_categories
from app.seeds.inventory_seed import seed_inventory
from app.api import otp
load_dotenv()

app = FastAPI()

origins = [
            "http://localhost.tiangolo.com",
            "https://localhost.tiangolo.com",
            "http://localhost",
            "http://localhost:8080"
          ]
app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods =['*'],
    allow_headers=['*'],
)

@app.on_event("startup")
def startup():
    db=Session(bind=engine,autoflush = False)
    create_on_startup(db)
    seed_categories(db)
    seed_products(db)
    seed_product_details(db)
    seed_product_images(db)
    seed_product_specifications(db)
    seed_product_features(db)
    seed_reviews(db)
    seed_inventory(db)
    
    
app.include_router(otp.app)
app.include_router(users.router)
app.include_router(product.router)
app.include_router(carts.router)
app.include_router(order.router)
app.include_router(address.router)
app.include_router(admin.router)













    



