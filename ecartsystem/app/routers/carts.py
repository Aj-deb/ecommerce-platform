from fastapi import APIRouter,Depends,HTTPException,status,Request
from app.schema.product_schema import ProductCreate,ProductReturn
from app.schema.cart_schema import CartDelete, CartDeleteReturn, CartItemCreate,CartItemResponse,CartResponse, Cartupdate
from app.models.user_model import User,Products,Cartitems,Cart
from app.core.db import get_db
from app.dependencies.secure_login import get_current_user
from app.models.inventory_model import Inventory
from app.core.redis_client import redis_client
from jose import JWTError

router = APIRouter(prefix="/carts")

@router.post("/add")
def add_to_cart(request:Request,data:CartItemCreate,db=Depends(get_db)):
    try:
        token = request.headers.get("Authorization").split(" ")[1]
        if token:
            current_user = get_cart(token, db)
    except Exception:
            current_user = None
    if current_user:
        cart_exist = db.query(Cart).filter(Cart.user_id == current_user.id ).first()
        if cart_exist is None:
            cart = Cart(user_id = current_user.id) 
            db.add(cart)
            db.commit()
            db.refresh(cart)
    redis_client.hincrby(
        f"cart:{data.guest_cart_id}",
        data.product_id,
        data.quantity
    )
    return {
        "success":True
    }


@router.post("/merge/{guest_cart_id}")
def cart_merge(request:Request,guest_cart_id:str,db=Depends(get_db)):
    token = request.headers.get("Authorization").split(" ")[1]
    current_user = get_current_user(token,db)
    cart_items = redis_client.hgetall(f"cart:{guest_cart_id}")
    user_exist = db.query(User).filter(User.id == current_user.id).first()
    if user_exist:
        db_cart = db.query(Cart).filter(Cart.user_id == user_exist.id).first()
        print(db_cart.id)
        db_cart_map = {
            item.product_id : item for item in db_cart.cart_items
        }
        
        for product_id ,qty in cart_items.items():
            if product_id in db_cart_map:
                db_cart_map[product_id].quantity += qty
            else:
                product = db.query(Products).filter(
                Products.id == product_id
                ).first()
                new_item = Cartitems(
                    cart_id = db_cart.id,
                    product_id  = product_id,
                    quantity = qty,
                    price = product.price
                )
                db.add(new_item)
    db.commit()
    redis_client.delete(f"cart:{guest_cart_id}")
    return {"success" : True}

@router.get("/display/{guest_cart_id}")
def get_cart(request:Request,guest_cart_id:str,db=Depends(get_db)):
    try:
        token = request.headers.get("Authorization").split(" ")[1]
        current_user = get_current_user(token,db)
    except Exception:
        current_user = None
    cart_list = []
    if current_user:
        db_cart_items = db.query(Cart).filter(Cart.user_id == current_user.id).first()
        db_cart_map = {
            item.product_id : item.quantity for item in db_cart_items.cart_items
        } 
        products_ids = [int(i) for i in db_cart_map]
        products = db.query(Products).filter(Products.id.in_(products_ids)).all()
        for i in products:
            cart_list.append({
                "product_id": i.id,
                "name": i.name,
                "price": i.price,
                "quantity": db_cart_map[i.id],
                "url" : i.url
            })
    else:
        cart_items = redis_client.hgetall(f"cart:{guest_cart_id}")
        products_ids = [int(i) for i in cart_items.keys()]
        products = db.query(Products).filter(Products.id.in_(products_ids)).all()
        for i in products:
            cart_list.append({
                "product_id": i.id,
                "name": i.name,
                "price": i.price,
                "quantity": int(cart_items[str(i.id)]),
                "url" : i.url
            })
    return {"data":cart_list}


@router.put("/update", response_model=CartDeleteReturn)
def decrease(
    request:Request,
    data:Cartupdate,
    db = Depends(get_db),
    
):
    try:
        token = request.headers.get("Authorization").split(" ")[1]
        current_user = get_current_user(token,db)
    except Exception:
        current_user = None
    if current_user:
        cart = db.query(Cart).filter(Cart.id == current_user.id).first()
        cart_item =db.query(Cartitems).filter(Cartitems.product_id == data.product_id ).first()
        
        cart_item.quantity = data.quantity
        db.commit()
    else:
        redis_client.hset(
            f"cart:{data.guest_cart_id}",
            data.product_id,
            data.quantity
        )
    return {
        "success":True,
        "msg":"Cart updated"
    }
    
@router.put("/increase/{product_id}")
def increase(
    product_id:int,
    db= Depends(get_db),
    current_user = Depends(get_current_user)
):

    item = db.query(Cartitems).join(Cart).filter(
    Cart.user_id == current_user.id,
    Cartitems.product_id == product_id,
    ).first()
    inventory = db.query(Cartitems).join(Inventory,Cartitems.product_id == Inventory.product_id).filter(
        Cartitems.product_id == product_id
    )
    if not item:
        raise HTTPException(404,"item not in cart")
    
    # if item.quantity >= inventory.quantity:
    #     raise HTTPException(404,"No above Stock")
    # else:
    item.quantity += 1
    db.commit()

    return {
        "success":True,
        "msg":"Cart updated"
    }
    
@router.delete('/delete/{item_id}')
def deleteitem(item_id:int, db = Depends(get_db)):
    # cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    # if not cart :
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="cart not found")
    item = db.query(Cartitems).filter(Cartitems.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="item not found")
    db.delete(item)
    db.commit()
    return {"item":"Item is deleted"}
        
