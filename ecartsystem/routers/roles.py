from fastapi import APIRouter,Depends,HTTPException,status,Request,BackgroundTasks
from schema.user_schema import UserVerify,UserCreate,UserReturn
from models.user_model import User
from dependencies.secure_login import verify_password,access_token,hashed_password,get_current_user,required_role
from db import get_db
from dependencies.greeting import greeting


router =  APIRouter(prefix="roles")
router.get('/create')

