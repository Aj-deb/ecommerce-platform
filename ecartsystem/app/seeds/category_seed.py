from app.models.category_model import Category

def seed_categories(db):
    
    # Parent categories
    electronics = Category(name="Electronics")
    fashion = Category(name="Fashion")

    db.add_all([electronics, fashion])
    db.commit()

    # Child categories
    mobiles = Category(
        name="Mobiles",
        parent_id=1
    )

    laptops = Category(
        name="Laptops",
        parent_id=1
    )

    men = Category(
        name="Men",
        parent_id=1
    )

    women = Category(
        name="Women",
        parent_id=1
    )

    db.add_all([mobiles, laptops, men, women])
    db.commit()

    db.close()