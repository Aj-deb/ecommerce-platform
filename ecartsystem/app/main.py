from fastapi import FastAPI , Depends
from db import Base , get_db , engine
from routers import users , product ,carts,order
from core.security import router as dashboard_router
from seed import create_on_startup
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from models import *
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


Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def startup():
    db=Session(bind=engine,autoflush = False)
    create_on_startup(db)
    
app.include_router(users.router)
app.include_router(product.router)
app.include_router(carts.router)
app.include_router(order.router)

app.include_router(dashboard_router)










    



