from fastapi import FastAPI,APIRouter,Depends,Request
from db import get_db
from dependencies.secure_login import get_current_user
router= APIRouter(prefix="/Dashboard")

@router.post("/")
def dashboard(current_user = Depends(get_current_user)):
    return {
        "message": "Welcome to dashboard",
        "user_id": current_user.id,
        "email": current_user.email,
        "name":current_user.name,
    }
    
    

            