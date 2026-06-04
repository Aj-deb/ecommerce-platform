import aio_pika
from app.core.config import RABBITMQ_URL


rabbitmq_connection = None

async def get_rabbitmq_connection():
    global rabbitmq_connection
    if rabbitmq_connection is None:
        rabbitmq_connection = await aio_pika.connect_robust(RABBITMQ_URL)
    return rabbitmq_connection