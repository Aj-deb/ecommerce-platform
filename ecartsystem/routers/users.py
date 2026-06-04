from fastapi import APIRouter,Depends,HTTPException,status,Request,BackgroundTasks
from schema.user_schema import UserVerify,UserCreate,UserReturn
from dependencies.secure_login import verify_password,access_token,hashed_password,get_current_user,required_permission
from db import get_db
from models.user_model import User
# from dependencies.greeting import greeting
# from models.roles_model import user_Roles

router = APIRouter(prefix="/users")

@router.post("/create")
async def create_users(data:UserCreate ,background_Task:BackgroundTasks,db=Depends(get_db)):
    user_exist = db.query(User).filter(User.email == data.email).first()
    if user_exist:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN,detail="already user created")
    hashed_pass = hashed_password(data.password)
    data = User(email = data.email , password = hashed_pass, name=data.name)
    db.add(data)
    db.commit()
    db.refresh(data)
    return data
    # background_Task.add_task(
    #     greeting,
    #     data
    # )
    # user = User()
    
    
    # return {"data":data,"msg":"email has been sent"}

@router.post("/login")
def login_detail(data : UserVerify ,background_Task:BackgroundTasks,db=Depends(get_db)):
    # background_Task.add_task(
    #     greeting
    # )
    user_exist = db.query(User).filter(User.email == data.email).first()
    if not user_exist:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="user not found")
    
    if not verify_password(data.password,user_exist.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Password not Verified")
    
    token = access_token({
        "sub":user_exist.email,
        # "role":user_exist.role
    })
    return {
        "access_Token": token,
        "token_type":"bearer"        
    }
    
@router.get('/me',response_model=UserCreate)
def get_current(user : User = Depends(get_current_user)):
    return user

@router.delete("/delete/{id}",dependencies=[Depends(required_permission([2]))])
def user_delete(id:int,db=Depends(get_db)):
    user_exist = db.query(User).filter(User.id == id ).first()
    if not user_exist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail = "user not found")
    db.delete(user_exist)
    db.commit()
    return {"msg":"user is deleted"}