from decimal import Decimal

from pydantic import BaseModel

class ProductCreate(BaseModel):
    name  : str
    price : int
    
    
class ProductReturn(BaseModel):
    id : int
    name  : str
    price : Decimal
    url: str    
    class config:
        form_attributes:True

