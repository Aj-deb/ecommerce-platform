from fastapi import APIRouter,Depends,HTTPException,status,Request,BackgroundTasks
from app.schema.user_schema import UserVerify,UserCreate,UserReturn
from app.models.user_model import User
from app.dependencies.secure_login import verify_password,access_token,hashed_password,get_current_user,required_role
from app.core.db import get_db
from app.dependencies.greeting import greeting


router =  APIRouter(prefix="/roles")
router.get('/create')

