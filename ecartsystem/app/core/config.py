from dotenv import load_dotenv
import os
load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
DATABASE_URL = os.getenv("DATABASE_URL")