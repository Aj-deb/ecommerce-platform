import asyncio
import json
import aio_pika

from app.core.config import RABBITMQ_URL

async def main():
    print("Waiting for msg")

    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    channel = await connection.channel()

    queue = await channel.declare_queue(
        "task_queue",
        durable=True
    )
    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                data = json.loads(message.body.decode())
                print("Processing ho rah...",data)
asyncio.run(main())