import random
def otp_generate():
    s = ""
    for i in range(4):
        value  = random.randint(48,57)
        s += chr(value)
    print(s)
    return s
    
otp_generate()