from fastapi import FastAPI , Depends,Request
from dependencies.greeting import greeting,calling
app = FastAPI()

# @app.get("http")
# async def email_sender(request:Request,call_next,sender = Depends(greeting)):
#     response = await call_next(request)
#     await calling()
#     response.headers["lund"] = "sadsa"
#     return response