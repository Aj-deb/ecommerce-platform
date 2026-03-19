from fastapi import APIRouter,Depends,HTTPException,status
from app.schema.product_schema import ProductCreate,ProductReturn
from app.schema.cart_schema import CartDelete, CartDeleteReturn, CartItemCreate,CartItemResponse,CartResponse
from app.models.user_model import User,Products,Cartitems,Cart
from app.core.db import get_db
from app.dependencies.secure_login import get_current_user
from app.models.inventory_model import Inventory

router = APIRouter(prefix="/carts")

@router.post("/Addtocart",response_model=CartItemResponse)
def cart_item(data:CartItemCreate, current_user : User = Depends(get_current_user),db=Depends(get_db)):
    cart_exist = db.query(Cart).filter(Cart.user_id == current_user.id ).first()
    if  cart_exist is None:
        cart = Cart(user_id = current_user.id) 
        db.add(cart)
        db.commit()
        db.refresh(cart)   
        
    product = db.query(Products).filter(Products.id == data.product_id ).first()
    if product is None:
          raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Product not found"
    )
    cart_item = db.query(Cartitems).filter(Cartitems.cart_id == cart_exist.id,Cartitems.product_id == product.id ).first()
    if cart_item:
        cart_item.quantity += data.quantity
    else:
        cart_item = Cartitems( 
                cart_id = cart_exist.id ,
                quantity = data.quantity ,
                price = product.price,
                product_id = data.product_id
        )
        db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    
    return cart_item

@router.get("/Viewcart", response_model=CartResponse)
def get_cart(db=Depends(get_db), current_user=Depends(get_current_user)):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if cart is None:
       return {
            "items":[],
            }
    items = db.query(Cartitems).filter(Cartitems.cart_id == cart.id).all()
    return {
        "cart_id":cart.id,
        "items":items
        }

@router.put("/decrease/{product_id}", response_model=CartDeleteReturn)
def decrease(
    product_id:int,
    db = Depends(get_db),
    current_user = Depends(get_current_user)
):

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(404,"Cart not found")

    item = db.query(Cartitems).filter(
        Cartitems.cart_id == cart.id,
        Cartitems.product_id == product_id
    ).first()

    if not item:
        raise HTTPException(404,"Item not in cart")

    if item.quantity > 1:
        item.quantity -= 1
    else:
        db.delete(item)

    db.commit()

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
        
