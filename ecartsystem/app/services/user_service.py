from core.redis_client import redis_client 
#SET AND GET
# def user():
#     redis_client.set("")
#ex,px,TTL,setex

#conditional set => using key conditionly
#nx =key set if not exist
#USED IN TRANSACTION AS FIRST PAYMENT GET BLOCK
#xx =update key only exist
#MSET AND MGET MULTIPL EKEYS
# lock = redis_client.set("lock",1,nx=True)

# if(lock):
#     print("nice")
# else:
#     print("no")
redis_client.set("health","ok")
redis_client.get('health')