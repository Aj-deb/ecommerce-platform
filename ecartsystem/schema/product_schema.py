from pydantic import BaseModel

class ProductCreate(BaseModel):
    name  : str
    price : int
    
class ProductReturn(ProductCreate):
    id : int
    

