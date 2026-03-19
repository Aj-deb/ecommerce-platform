# from fastapi import APIRouter,Depends,FastAPI,BackgroundTasks,Request
# from schema.product_schema import ProductCreate,ProductReturn
# from models.user_model import User
# from models.user_model import Products
# from db import get_db
# from fastapi.templating import Jinja2Templates
# from pydantic import EmailStr,BaseModel
# from typing import Any ,Dict
# from dependencies.config import conf
# from fastapi_mail import FastMail,MessageSchema,MessageType
# from fastapi.responses import HTMLResponse,JSONResponse
# from dependencies.secure_login import get_current_user
# app =FastAPI()

# # class Email(BaseModel):
# #     email : list[EmailStr]
# #     body : Dict[Any,str]
# #     subject : str


# async def greeting(data = Depends(get_current_user)):
#     message = MessageSchema(
#             recipients = [data.email],
#             subject = "hello ",
#             template_body= {
#                 "name":data.name
#             },
#             subtype = MessageType.html
#         )

#     fm = FastMail(conf)
#     await fm.send_message(message,template_name="index.html")
    