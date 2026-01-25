from fastapi import APIRouter,Depends,HTTPException,status
from schema.product_schema import ProductCreate,ProductReturn
from schema.cart_schema import CartItemCreate,CartItemResponse,CartResponse
from models.user_model import User,Products,Cartitems,Cart
from db import get_db
from dependencies.secure_login import get_current_user

router = APIRouter(prefix="/carts")
@router.post("/create")
def cart_item(current_user : User = Depends(get_current_user),db=Depends(get_db)):
    cart_exist = db.query(Cart).filter(Cart.user_id == current_user.id ).first()
    if  cart_exist is None:
        cart = Cart(user_id = current_user.id) 
        db.add(cart)
        db.commit()
        db.refresh(cart)
        return {"msg":"cart has been created successfully"}
        
@router.post("/Addtocart",response_model=CartItemResponse)
def cart_item(data:CartItemCreate, current_user : User = Depends(get_current_user),db=Depends(get_db)):
    cart_exist = db.query(Cart).filter(Cart.user_id == current_user.id ).first()
    if cart_exist is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Cart empty"
    )
    product = db.query(Products).filter( Products.id == data.product_id ).first()
    if product is None:
          raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Product not found"
    )
    cartitem = Cartitems( 
            cart_id = cart_exist.id ,
            quantity = data.quantity ,
            price = product.price,
            product_id = data.product_id 
        )
    db.add(cartitem)
    db.commit()
    db.refresh(cartitem)
    return cartitem

@router.get("/items", response_model=list[CartItemResponse])
def get_cart(db=Depends(get_db), current_user=Depends(get_current_user)):

    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
       return {
            "items":[],
            "message":"Cart is empty"
            }
    items = db.query(Cartitems).filter(Cartitems.cart_id == cart.id).all()
    return {"items":items}

@router.put("/increase/{item_id}")
def increase(item_id :int ,db=Depends(get_db),current_user =Depends(get_current_user)):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="cart not found")
    item = db.query(Cartitems).filter(Cartitems.id == item_id).first()
    item.quantity += 1 
    db.commit()
    db.refresh(item)
    return item

@router.put("/decrease/{item_id}")
def increase(item_id :int ,db=Depends(get_db),current_user =Depends(get_current_user)):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="cart not found")
    item = db.query(Cartitems).filter(Cartitems.id == item_id).first()
    if item.quantity < 1:
        db.delete(item)
        db.commit()
        return {"item":"deleted"}
    item.quantity -= 1
    db.commit()
    db.refresh(item)
    return item

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
        
