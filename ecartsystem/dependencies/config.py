from fastapi import FastAPI
from fastapi_mail import FastMail,ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME= "saj06224@gmail.com",
    MAIL_PASSWORD= "gmyk kfbw lfzr krxq",
    MAIL_FROM="saj06224@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    TEMPLATE_FOLDER="templates"
)