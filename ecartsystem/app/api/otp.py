from fastapi import APIRouter,Depends
from app.core.redis_client import redis_client
from app.schema.otp_schema import EmailOtp, Otp, OtpReturn
import random
from app.core.db import get_db
from app.dependencies.secure_login import get_current_user
from app.core.otp import otp_generate
from app.services.rabbitmq_service import RabbitMQService

app = APIRouter(prefix="/otp")
rabbitmq_service = RabbitMQService()
@app.post("/")
def otp(email:EmailOtp):
    code = otp_generate()
    redis_client.set(f"otp:{email.email}",str(code),ex=300)
    rabbitmq_service.publish_otp_email(email.email, code)
    
@app.post("/verify",response_model=OtpReturn)
def verify_otp(otp:Otp):
    saved_otp = redis_client.get(f"otp:{otp.email}")
    if saved_otp == otp.otp:
        return {
            "success":True,
            "message":"otp verified"
        }
    return {
        "success":False,
        "message":"Not valid"
    }
    