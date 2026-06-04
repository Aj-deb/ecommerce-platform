from decimal import Decimal

from app.models.user_model import Products, ProductDetail,ProductFeature,ProductImage,ProductSpecification
from app.models.inventory_model import Inventory

from app.models.review import Review

from decimal import Decimal
from app.models.user_model import Products, ProductDetail

from decimal import Decimal
from app.models.user_model import Products, ProductDetail


def seed_products(db):
    products = [
        {
            "id": 1,
            "name": "iPhone 16 Pro",
            "price": Decimal("1199.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/iphone.jpg",
        },
        {
            "id": 2,
            "name": "Samsung Galaxy S24",
            "price": Decimal("999.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/samsung.jpg",
        },
        {
            "id": 3,
            "name": "MacBook Pro",
            "price": Decimal("1899.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/laptop.jpg",
        },
        {
            "id": 4,
            "name": "Sony WH-1000XM5",
            "price": Decimal("349.99"),
            "category_id": 3,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/headphones.jpg",
        },
        {
            "id": 5,
            "name": "Apple Watch Series 10",
            "price": Decimal("499.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/smartwatch.jpg",
        },
        {
            "id": 6,
            "name": "Canon EOS R50",
            "price": Decimal("899.99"),
            "category_id": 1,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/camera.jpg",
        },
        {
            "id": 7,
            "name": "Nike Air Max",
            "price": Decimal("149.99"),
            "category_id": 2,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/shoes.jpg",
        },
        {
            "id": 8,
            "name": "Oversized T-Shirt",
            "price": Decimal("39.99"),
            "category_id": 2,
            "url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/tshirt.jpg",
        },
    ]

    for p in products:
        exists = db.query(Products).filter(Products.id == p["id"]).first()
        if not exists:
            db.add(Products(**p))

    db.commit()
    print("✅ Products seeded successfully!")


def seed_product_details(db):
    details = [
        {
            "product_id": 1,
            "name": "iPhone 16 Pro",
            "description": "The iPhone 16 Pro features the latest A18 Pro chip, titanium body, advanced camera system, and all-day battery life.",
            "rating": Decimal("4.8"),
            "rating_count": 2841,
            "final_price": Decimal("1099.99"),
            "discount_percentage": 8,
            "stock_quantity": 12,
            "sku": "APL-IP16P-256-BLK",
            "warranty": "1 Year Apple Warranty",
            "return_policy": "7 Day Easy Return",
        },
        {
            "product_id": 2,
            "name": "Samsung Galaxy S24",
            "description": "Samsung Galaxy S24 with dynamic AMOLED display, Snapdragon 8 Gen performance and pro-grade camera.",
            "rating": Decimal("4.6"),
            "rating_count": 1932,
            "final_price": Decimal("929.99"),
            "discount_percentage": 7,
            "stock_quantity": 18,
            "sku": "SMS-S24-256-GRY",
            "warranty": "1 Year Samsung Warranty",
            "return_policy": "7 Day Easy Return",
        },
        {
            "product_id": 3,
            "name": "MacBook Pro",
            "description": "MacBook Pro powered by Apple Silicon with stunning Liquid Retina display and pro performance.",
            "rating": Decimal("4.9"),
            "rating_count": 1244,
            "final_price": Decimal("1799.99"),
            "discount_percentage": 5,
            "stock_quantity": 7,
            "sku": "APL-MBP-14-512",
            "warranty": "1 Year Apple Warranty",
            "return_policy": "7 Day Easy Return",
        },
        {
            "product_id": 4,
            "name": "Sony WH-1000XM5",
            "description": "Industry-leading noise cancelling headphones with premium sound quality and long battery life.",
            "rating": Decimal("4.7"),
            "rating_count": 982,
            "final_price": Decimal("319.99"),
            "discount_percentage": 9,
            "stock_quantity": 20,
            "sku": "SNY-WH1000XM5-BLK",
            "warranty": "1 Year Sony Warranty",
            "return_policy": "7 Day Easy Return",
        },
        {
            "product_id": 5,
            "name": "Apple Watch Series 10",
            "description": "Advanced health tracking, sleek design, and powerful performance in Apple Watch Series 10.",
            "rating": Decimal("4.8"),
            "rating_count": 1511,
            "final_price": Decimal("459.99"),
            "discount_percentage": 8,
            "stock_quantity": 14,
            "sku": "APL-AW10-45MM",
            "warranty": "1 Year Apple Warranty",
            "return_policy": "7 Day Easy Return",
        },
        {
            "product_id": 6,
            "name": "Canon EOS R50",
            "description": "Compact mirrorless camera with 4K video, fast autofocus and professional quality output.",
            "rating": Decimal("4.5"),
            "rating_count": 741,
            "final_price": Decimal("829.99"),
            "discount_percentage": 8,
            "stock_quantity": 9,
            "sku": "CAN-EOSR50-BLK",
            "warranty": "1 Year Canon Warranty",
            "return_policy": "7 Day Easy Return",
        },
        {
            "product_id": 7,
            "name": "Nike Air Max",
            "description": "Stylish and comfortable everyday sneakers with premium cushioning and durable sole.",
            "rating": Decimal("4.4"),
            "rating_count": 563,
            "final_price": Decimal("129.99"),
            "discount_percentage": 13,
            "stock_quantity": 25,
            "sku": "NKE-AMX-WHT-42",
            "warranty": "6 Month Brand Warranty",
            "return_policy": "7 Day Easy Return",
        },
        {
            "product_id": 8,
            "name": "Oversized T-Shirt",
            "description": "Soft cotton oversized t-shirt with relaxed fit for everyday comfort and style.",
            "rating": Decimal("4.3"),
            "rating_count": 418,
            "final_price": Decimal("29.99"),
            "discount_percentage": 25,
            "stock_quantity": 40,
            "sku": "OTS-COT-BLK-M",
            "warranty": "No Warranty",
            "return_policy": "7 Day Easy Return",
        },
    ]

    for item in details:
        exists = db.query(ProductDetail).filter(ProductDetail.product_id == item["product_id"]).first()
        if not exists:
            db.add(ProductDetail(**item))

    db.commit()
    print("✅ Product details seeded successfully!")
    
def seed_product_images(db):
    images = [
        {"product_id": 1, "image_url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/iphone.jpg"},
        {"product_id": 1, "image_url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/iphone-2.jpg"},
        {"product_id": 1, "image_url": "https://prod-s3-demo.s3.ap-southeast-2.amazonaws.com/iphone-3.jpg"},
    ]

    for item in images:
        exists = db.query(ProductImage).filter(
            ProductImage.product_id == item["product_id"],
            ProductImage.image_url == item["image_url"]
        ).first()
        if not exists:
            db.add(ProductImage(**item))

    db.commit()
    print("✅ Product images seeded successfully!")


def seed_product_specifications(db):
    specs = [
        {"product_id": 1, "name": "Display", "value": "6.3-inch Super Retina XDR"},
        {"product_id": 1, "name": "Chip", "value": "A18 Pro"},
        {"product_id": 1, "name": "Storage", "value": "256GB"},
        {"product_id": 1, "name": "Camera", "value": "48MP Main + 12MP Ultra Wide"},
    ]

    for item in specs:
        exists = db.query(ProductSpecification).filter(
            ProductSpecification.product_id == item["product_id"],
            ProductSpecification.name == item["name"]
        ).first()
        if not exists:
            db.add(ProductSpecification(**item))

    db.commit()
    print("✅ Product specifications seeded successfully!")


def seed_product_features(db):
    features = [
        {"product_id": 1, "feature": "A18 Pro chip for ultra-fast performance"},
        {"product_id": 1, "feature": "Titanium premium design"},
        {"product_id": 1, "feature": "Advanced triple camera system"},
        {"product_id": 1, "feature": "All-day battery life"},
    ]

    for item in features:
        exists = db.query(ProductFeature).filter(
            ProductFeature.product_id == item["product_id"],
            ProductFeature.feature == item["feature"]
        ).first()
        if not exists:
            db.add(ProductFeature(**item))

    db.commit()
    print("✅ Product features seeded successfully!")


def seed_reviews(db):
    reviews = [
        {
            "product_id": 1,
            "user_id": None,
            "author": "Arjun",
            "rating": 5,
            "title": "Excellent Phone",
            "comment": "Amazing performance and camera quality. Battery backup is also great.",
            "helpful": 12,
            "not_helpful": 1,
        },
        {
            "product_id": 1,
            "user_id": None,
            "author": "Riya",
            "rating": 4,
            "title": "Great but expensive",
            "comment": "Very smooth and premium device but pricing is high.",
            "helpful": 8,
            "not_helpful": 2,
        },
    ]

    for item in reviews:
        exists = db.query(Review).filter(
            Review.product_id == item["product_id"],
            Review.author == item["author"]
        ).first()
        if not exists:
            db.add(Review(**item))

    db.commit()
    print("✅ Reviews seeded successfully!")