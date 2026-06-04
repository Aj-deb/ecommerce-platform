# app/services/rabbitmq_service.py

from app.services.rabbitmq_client import RabbitMQClient


class RabbitMQService:
    def __init__(self):
        self.otp_queue = "otp_email_queue"

    def publish_otp_email(self, email: str, otp: str):
        message = {
            "type": "send_otp",
            "to": email,
            "otp": otp
        }

        client = RabbitMQClient(self.otp_queue)
        client.publish(message)
        client.close()