# app/services/otp_email_consumer.py

import json
import pika
from app.email_service import send_email


QUEUE_NAME = "otp_email_queue"


def callback(ch, method, properties, body):
    try:
        print("Message received from RabbitMQ")

        message = json.loads(body)
        print("Decoded message:", message)

        email = message["to"]
        otp = message["otp"]

        print(f"Preparing to send OTP to {email}")

        subject = "Your OTP Code"
        email_body = f"""
Hello,

Your OTP is: {otp}

This OTP is valid for 5 minutes.
Do not share it with anyone.
"""

        send_email(
            to=email,
            subject=subject,
            body=email_body
        )

        print("Email sent successfully")
        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print(f"Error processing OTP email: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def consume():
    print("Starting OTP Email Consumer...")

    rabbitmq_url = os.getenv("RABBITMQ_URL")

    if not rabbitmq_url:
        raise Exception("RABBITMQ_URL not found")

    params = pika.URLParameters(rabbitmq_url)

    print("Connecting to RabbitMQ...")
    connection = pika.BlockingConnection(params)
    print("Connected successfully!")

    channel = connection.channel()

    channel.queue_declare(
        queue=QUEUE_NAME,
        durable=True
    )

    channel.basic_qos(prefetch_count=1)

    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=callback,
        auto_ack=False
    )

    print("Waiting for OTP email messages...")
    channel.start_consuming()

if __name__ == "__main__":
    consume()
