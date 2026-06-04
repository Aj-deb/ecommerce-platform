from app.models.inventory_model import Inventory


def seed_inventory(db):
    inventory = [
        {"product_id": 1, "quantity": 12},
        {"product_id": 2, "quantity": 18},
        {"product_id": 3, "quantity": 7},
    ]

    for item in inventory:
        exists = db.query(Inventory).filter(
            Inventory.product_id == item["product_id"]
        ).first()

        if not exists:
            db.add(Inventory(**item))

    db.commit()
    print("✅ Inventory seeded successfully!")