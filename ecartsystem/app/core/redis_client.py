import os
import redis
import  json

from dotenv import load_dotenv
load_dotenv()
#.ENV FILE
# REDIS_HOST = os.getenv("REDIS_HOST","localhost") #IF REDIS_HOST AVAIBLE IN .ENV THEN THAT IF NOT THEN LOCALHSOT
REDIS_HOST = os.getenv("REDIS_HOST")

# REDIS_PORT = int(os.getenv("REDIS_PORT,6379"))
REDIS_PORT = int(os.getenv("REDIS_PORT"))


# REDIS_DB = int(os.getenv("REDIS_DB",0))
REDIS_DB = int(os.getenv("REDIS_DB"))
# DB 0 → dev
# DB 1 → test
# DB 2 → staging
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
# REDIS_PASSWORD = os.getenv("REDIS_PASSWORD",None)

redis_client =redis.Redis(
    host = REDIS_HOST,
    port= REDIS_PORT,
    db= REDIS_DB,
    password=REDIS_PASSWORD,
    decode_responses=True #as redis store and retrun bytes so python return bytes need to transa;te to string
)
user_id =2
json_data={
    "hellp":"dsad"
} # redis store stirng and bytes
redis_client.set(f"user:{user_id}",json.dumps(json_data),ex=300)
data = redis_client.get(f"user:{user_id}")
data = json.loads(data)#loads = importf eom stirng and load =>load from file
print(data)

# redis_client.set("health","gandu",xx=True)
# print(redis_client.get("health"))

# best method is hash  se mappting