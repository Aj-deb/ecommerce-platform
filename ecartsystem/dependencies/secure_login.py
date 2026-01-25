from fastapi import Depends ,FastAPI,HTTPException,status
from pwdlib import PasswordHash
from datetime import datetime,timedelta
from fastapi.security import OAuth2PasswordBearer
import jwt
from models.roles_model import Role_permission
from models.user_model import User
from jose import JWTError
from db import get_db

SECRET_KEY = "AJSIGNH1"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()

def verify_password(plain_password,hashed_password):
    return password_hash.verify(plain_password,hashed_password)

def hashed_password(password):
    return password_hash.hash(password)

def access_token(data:dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    
    jwt_token = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return jwt_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(token:str = Depends(oauth2_scheme),db = Depends(get_db)):
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        email:str = payload.get("sub") 
        # role :str = payload.get("role")  
        
        if email is None :
                raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        user_exist = db.query(User).filter(User.email == email).first()
        if not user_exist:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User not found"
            )
        return user_exist
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

def required_permission(permissions:list[int]):
    def checker(user:User =Depends(get_current_user),db = Depends(get_db)):
        user_permission = db.query(Role_permission).filter(
        Role_permission.permissions_id.in_(permissions),
        Role_permission.roles_id  == user.role_id ).first()
        if not user_permission:
            raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Permission denied"
            )
    return checker

