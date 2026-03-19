from fastapi import FastAPI
from decimal import Decimal
from app.models.user_model import Products
from app.models.inventory_model import Inventory
app = FastAPI()


def seed_inventory(db):
    inventory = [
    {"id":1,"product_id":17,"quantity":10},
    {"id":2,"product_id":18,"quantity":15},
    {"id":3,"product_id":19,"quantity":8},
    {"id":4,"product_id":20,"quantity":20},
    {"id":5,"product_id":21,"quantity":12},
    {"id":6,"product_id":22,"quantity":5},
    {"id":7,"product_id":23,"quantity":25},
    {"id":8,"product_id":24,"quantity":30},
    {"id":9,"product_id":25,"quantity":7},
    {"id":10,"product_id":26,"quantity":18},
    {"id":11,"product_id":27,"quantity":14},
    {"id":12,"product_id":28,"quantity":22},
    {"id":13,"product_id":29,"quantity":9},
    {"id":14,"product_id":30,"quantity":11},
    {"id":15,"product_id":31,"quantity":6}
    ]
    for p in inventory:
        product = Inventory(**p)
        prod_exist = db.query(Inventory).filter(Inventory.product_id == p["product_id"]).first()
        if not prod_exist:
            db.add(product)

    db.commit()
    db.close()

    print("✅ Inventory seeded successfully!")

