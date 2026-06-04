from fastapi import APIRouter,Depends,HTTPException,status
from models.user_model import User
from dependencies.secure_login import get_current_user
from db import get_db
from models.user_model import Cartitems,Cart
from models.orders_model import Order,Orderitems,OrderStatus
from schema.order_schema import OrderCreate,OrderResponse,OrdersResponse
router= APIRouter(prefix="/orders")

@router.post("/create",response_model=OrderResponse)
def orderplaced(order :OrderCreate,db=Depends(get_db),current_user=Depends(get_current_user)):
    #copy data formr cartitems to orderitems
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if cart is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="cart is empty")
    cartitems =db.query(Cartitems).filter(cart.id == Cartitems.cart_id).all()

    order = Order(user_id =current_user.id , status = OrderStatus.PROCESSING)
    db.add(order)
    db.flush() # genrwete a order id if something went wwrong
    # no argument by flush
    
    for item in cartitems:
        orderitems = Orderitems(
            price= item.price ,
            quantity=item.quantity,
            product_id = item.product_id,
            order_id = order.id
        )
        db.add(orderitems)
    # print(status)
    db.commit()
    db.refresh(order)
    return {
        "order_id":order.id,
        "status" : order.status,
        "orderitems":[{ 
                "price" : item.price,
                "quantity":item.quantity,
                "name":item.product.name
            }
            for item in order.orderitems
        ]
        }

@router.put("/cancel/{orderid}")
def updatestatus(orderid:int ,db = Depends(get_db),current_user=Depends(get_current_user)):
    order_exist = db.query(Order).filter(Order.id == orderid,Order.user_id == current_user.id).first()
    if not order_exist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="order not found")
    order_exist.status = OrderStatus.CANCELLED
    db.commit()
    db.refresh(order_exist)
    return {
        "status":"order has been cancelled"
    }

@router.get("/",response_model=list[OrdersResponse])
def orders(db = Depends(get_db),current_user=Depends(get_current_user)):
    order_exist = db.query(Order).filter(Order.user_id == current_user.id).all()
    if not order_exist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Empty Order")
    return [{
        "status":item.status,
        "order_id":item.id
    }for item in order_exist]
    
@router.get("/{id}",response_model=OrderResponse)
def orders(id:int,db = Depends(get_db),current_user=Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == id ,Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Order not found")
    return {
        "order_id":order.id,
        "status" : order.status,
        "orderitems":[{ 
                "price" : item.price,
                "quantity":item.quantity,
                "name":item.product.name
            }
            for item in order.orderitems
        ]
        }