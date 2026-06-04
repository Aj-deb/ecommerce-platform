from sqlalchemy.engine import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")
engine  = create_engine(DATABASE_URL)

session = sessionmaker(bind=engine, autoflush = False)

Base = declarative_base()

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
