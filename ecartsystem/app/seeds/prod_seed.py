from fastapi import FastAPI
from decimal import Decimal
from app.models.user_model import Products
app = FastAPI()


def seed_products(db):
    products = [
        {
            "name": "iPhone",
            "price": Decimal("999.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/iphone.jpg",
        },
        {
            "name": "Samsung Phone",
            "price": Decimal("899.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/samsung.jpg",
        },
        {
            "name": "Laptop",
            "price": Decimal("1299.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/laptop.jpg",
        },
        {
            "name": "Headphones",
            "price": Decimal("199.99"),
            "category_id": 3,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/headphones.jpg",
        },
        {
            "name": "Smartwatch",
            "price": Decimal("299.99"),
            "category_id": 1,

            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/smartwatch.jpg",
        },
        {
            "name": "Camera",
            "price": Decimal("799.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/camera.jpg",
        },
        {
            "name": "Shoes",
            "price": Decimal("120.00"),
            "category_id": 2,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/shoes.jpg",
        },
        {
            "name": "T-Shirt",
            "price": Decimal("40.00"),
            "category_id": 2,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/tshirt.jpg",
        },
        {
            "name": "Jacket",
            "price": Decimal("180.00"),
            "category_id": 2,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/jacket.jpg",
        },
        {
            "name": "Backpack",
            "price": Decimal("90.00"),
            "category_id": 3,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/backpack.jpg",
        },
        {
            "name": "Keyboard",
            "price": Decimal("80.00"),
            "category_id": 3,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/keyboard.jpg",
        },
        {
            "name": "Mouse",
            "price": Decimal("35.00"),
            "category_id": 3,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/mouse.jpg",
        },
        {
            "name": "Tablet",
            "price": Decimal("450.00"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/tablet.jpg",
        },
        {
            "name": "Speaker",
            "price": Decimal("150.00"),
            "category_id": 3,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/speaker.jpg",
        },
        {
            "name": "Monitor",
            "price": Decimal("300.00"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/monitor.jpg",
        },
    ]

    for p in products:
        product = Products(**p)
        prod_exist = db.query(Products).filter(Products.name == p["name"]).first()
        if not prod_exist:
            db.add(product)

    db.commit()
    db.close()

    print("✅ Products seeded successfully!")

