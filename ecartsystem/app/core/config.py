from dotenv import load_dotenv
import os
load_dotenv()
RABBITMQ_URL = "amqp://user:password@localhost:5672/"
DATABASE_URL = os.getenv("DATABASE_URL")