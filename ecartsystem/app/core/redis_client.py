import redis 
import os
from dotenv import load_dotenv
load_dotenv()
redis_port = os.getenv("REDIS_PORT")
redis_host = os.getenv("REDIS_HOST")
redis_db = os.getenv("REDIS_DB")
redis_password = os.getenv("REDIS_PASSWORD")

redis_client  = redis.Redis(
    host= redis_host,
    port = redis_port,
    db = redis_db,
    password = redis_password,
    decode_responses=True
) 