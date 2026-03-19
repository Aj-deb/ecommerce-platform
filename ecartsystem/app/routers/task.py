from fastapi import APIRouter,Depends,HTTPException,status,Request,BackgroundTasks
from app.services.producer import send_message
router =  APIRouter(prefix="/task")

@router.post('/create')
async def create_task(data:dict):
    await send_message(data)
    return {
        "msg":"Task has been queued"
    }
