from dotenv import load_dotenv
import os
load_dotenv(".env.local")

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
DATABASE_URL = os.getenv("DATABASE_URL")
