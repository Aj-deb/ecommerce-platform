import json 
import aio_pika
from app.core.rabbitmq import get_rabbitmq_connection

async def send_message(data:dict):
    connection = await get_rabbitmq_connection()
    channel = await connection.channel()
    QUEUE_NAME = "task_queue"
    queue = await channel.declare_queue(
        "task_queue",
        durable =True
    )
    message = aio_pika.Message(body = json.dumps(data).encode(),delivery_mode=aio_pika.DeliveryMode.PERSISTENT)
    
    await channel.default_exchange.publish(
        message,
        routing_key = QUEUE_NAME
    )
    
    # await connection.close()
    
