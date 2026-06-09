import json
import pika
import os
from dotenv import load_dotenv

load_dotenv(".env.local")


class RabbitMQClient:
    def __init__(self, queue_name: str):
        self.queue_name = queue_name
        self.connection = None
        self.channel = None

    def connect(self):
        rabbitmq_url = os.getenv("RABBITMQ_URL")

        params = pika.URLParameters(rabbitmq_url)

        self.connection = pika.BlockingConnection(params)
        self.channel = self.connection.channel()

        self.channel.queue_declare(
            queue=self.queue_name,
            durable=True
        )

    def publish(self, message: dict):
        if not self.channel:
            self.connect()

        self.channel.basic_publish(
            exchange="",
            routing_key=self.queue_name,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2
            ),
        )

    def close(self):
        if self.connection and self.connection.is_open:
            self.connection.close()