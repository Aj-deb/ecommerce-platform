from sqlalchemy.engine import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

engine  = create_engine("sqlite:///database.db")

session = sessionmaker(bind=engine, autoflush = False)

Base = declarative_base()

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
