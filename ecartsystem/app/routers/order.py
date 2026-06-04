from fastapi import APIRouter,Depends,HTTPException,status
from app.models.user_model import User
from app.dependencies.secure_login import get_current_user
from app.core.db import get_db
from app.models.user_model import Cartitems,Cart
from app.models.orders_model import Order,Orderitems,OrderStatus
from app.schema.order_schema import OrderCreate,OrderResponse,OrdersResponse,OrderItem
from app.schema.CancelOrderResponse import CancelOrderResponse
from sqlalchemy.orm import Session, joinedload

router= APIRouter(prefix="/orders")
@router.post("/create/{cart_id}")
def orderplaced(
    cart_id:int,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    cart = db.query(Cart).filter(
        Cart.id == cart_id,
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    cartitems = db.query(Cartitems).filter(
        Cartitems.cart_id == cart_id
    ).all()

    if not cartitems:
        raise HTTPException(
            status_code=404,
            detail="Cart is empty"
        )

    total = 0

    for item in cartitems:
        total += item.product.price * item.quantity

    order = Order(
        user_id=current_user.id,
        status=OrderStatus.PROCESSING,
        total_amount=total
    )

    db.add(order)
    db.flush()   # generate order.id

    for item in cartitems:

        orderitem = Orderitems(
            price=item.product.price,
            quantity=item.quantity,
            product_id=item.product_id,
            order_id=order.id
        )

        db.add(orderitem)

    # delete cartitems FIRST
    db.query(Cartitems).filter(
        Cartitems.cart_id == cart_id
    ).delete()

    # then delete cart
    db.delete(cart)

    db.commit()

    db.refresh(order)

    return {
        "success": True,
        "order_id": order.id,
        "message": "Order created successfully"
    }
@router.put("/cancel/{orderid}",response_model=CancelOrderResponse)
def update_status(orderid:int ,db = Depends(get_db),current_user=Depends(get_current_user)):
    order_exist = db.query(Order).filter(Order.id == orderid,Order.user_id == current_user.id).first()
    if not order_exist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="order not found")
    if order_exist.status not in [OrderStatus.PENDING, OrderStatus.PROCESSING]:
        raise HTTPException(
        status_code=400,
        detail="Order cannot be cancelled"
    )
    order_exist.status = OrderStatus.CANCELLED
    db.commit()
    db.refresh(order_exist)
    return {
        "success": True,
        "order_id": order_exist.id,
        "new_status": order_exist.status
    }
    
@router.get("/",response_model=list[OrdersResponse])
def get_orders(db = Depends(get_db),current_user=Depends(get_current_user)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.id.desc()).limit(10)
    return [{
        "order_id":item.id,
        "status":item.status,
    }for item in orders]
    
@router.get("/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    order = (
        db.query(Order)
        .options(
            joinedload(Order.orderitems).joinedload(Orderitems.product),
            joinedload(Order.user).joinedload(User.addresses)
        )
        .filter(
            Order.id == order_id,
            Order.user_id == current_user.id
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    default_address = next(
        (addr for addr in order.user.addresses if addr.is_default),
        order.user.addresses[0] if order.user.addresses else None
    )

    items = [
        {
            "id": item.id,
            "price": item.price,
            "quantity": item.quantity,
            "product_id": item.product.id,
            "product_name": item.product.name,
            "product_image": item.product.url,
        }
        for item in order.orderitems
    ]

    return {
        "id": order.id,
        "status": order.status,
        "created_at": order.created_at,
        "payment_method": "Cash on Delivery",
        "subtotal": order.total_amount,
        "shipping_fee": 5,
        "total": order.total_amount + 5,
        "shipping_address": {
            "name": f"{default_address.first_name} {default_address.second_name}" if default_address else "",
            "phone": default_address.phone_no if default_address else "",
            "line1": f"{default_address.house_no}, Street No. {default_address.street_no}" if default_address else "",
            "line2": f"{default_address.location}, {default_address.landmark}" if default_address else "",
            "city": default_address.city if default_address else "",
            "state": default_address.state if default_address else "",
        },
        "items": items
    }
# #SELECT orders.id,
#        products.name,
#       order_items.quantity
# FROM orders
# JOIN order_items
# ON orders.id = order_items.order_id
# JOIN products
# ON order_items.product_id = products.id;