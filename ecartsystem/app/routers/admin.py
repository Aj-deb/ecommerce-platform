from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.db import get_db
from app.dependencies.admin_auth import create_admin_token, get_current_admin, verify_admin_credentials
from app.models.orders_model import Order, Orderitems
from app.models.user_model import Cart, Cartitems, Products, User
from app.schema.admin_schema import (
    AdminCartUpdate,
    AdminLoginRequest,
    AdminOrderItemsUpdate,
    AdminOrderStatusUpdate,
    AdminTokenResponse,
)
from app.schema.order_schema import OrderStatus

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/login", response_model=AdminTokenResponse)
def admin_login(payload: AdminLoginRequest):
    if not verify_admin_credentials(payload.username, payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")
    return {"access_token": create_admin_token(), "token_type": "bearer"}


@router.get("/me")
def admin_me(_admin=Depends(get_current_admin)):
    return _admin


@router.get("/products")
def admin_products(
    q: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    query = db.query(Products)
    if q:
        words = [part for part in q.strip().split() if part][:5]
        for word in words:
            query = query.filter(Products.name.ilike(f"%{word}%"))
    products = query.order_by(Products.id.desc()).limit(limit).all()
    return [
        {"id": p.id, "name": p.name, "price": p.price, "url": p.url, "category_id": p.category_id}
        for p in products
    ]


@router.get("/orders")
def admin_list_orders(
    limit: int = 25,
    status_filter: Optional[OrderStatus] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    query = db.query(Order).options(joinedload(Order.user)).order_by(Order.id.desc())
    if status_filter:
        query = query.filter(Order.status == status_filter)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    orders = query.limit(limit).all()
    return [
        {
            "id": o.id,
            "user_id": o.user_id,
            "user_email": o.user.email if o.user else None,
            "status": o.status,
            "created_at": o.created_at,
            "total_amount": o.total_amount,
        }
        for o in orders
    ]


@router.get("/orders/{order_id}")
def admin_get_order(
    order_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    order = (
        db.query(Order)
        .options(joinedload(Order.orderitems).joinedload(Orderitems.product), joinedload(Order.user))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

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
        "user_id": order.user_id,
        "user_email": order.user.email if order.user else None,
        "status": order.status,
        "created_at": order.created_at,
        "subtotal": order.total_amount,
        "shipping_fee": 5,
        "total": order.total_amount + 5,
        "items": items,
    }


@router.put("/orders/{order_id}/status")
def admin_update_order_status(
    order_id: int,
    payload: AdminOrderStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return {"success": True, "order_id": order.id, "new_status": order.status}


@router.put("/orders/{order_id}/items")
def admin_update_order_items(
    order_id: int,
    payload: AdminOrderItemsUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    order = db.query(Order).options(joinedload(Order.orderitems)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")

    existing_by_id = {item.id: item for item in order.orderitems}
    keep_ids = set()
    new_total = 0

    for item in payload.items:
        product = db.query(Products).filter(Products.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product not found: {item.product_id}")

        if item.id and item.id in existing_by_id:
            order_item = existing_by_id[item.id]
            order_item.product_id = product.id
            order_item.quantity = item.quantity
            order_item.price = product.price
            keep_ids.add(order_item.id)
        else:
            order_item = Orderitems(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price,
            )
            db.add(order_item)

        new_total += product.price * item.quantity

    # delete removed items
    for existing in list(order.orderitems):
        if existing.id not in keep_ids and existing.id in existing_by_id:
            db.delete(existing)

    order.total_amount = new_total
    db.commit()

    return {"success": True, "order_id": order.id, "new_total_amount": order.total_amount}


@router.get("/users/{user_id}/cart")
def admin_get_user_cart(
    user_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        return {"user_id": user_id, "cart_id": None, "items": []}

    items = (
        db.query(Cartitems)
        .options(joinedload(Cartitems.product))
        .filter(Cartitems.cart_id == cart.id)
        .all()
    )
    return {
        "user_id": user_id,
        "cart_id": cart.id,
        "items": [
            {
                "id": i.id,
                "product_id": i.product_id,
                "product_name": i.product.name if i.product else None,
                "quantity": i.quantity,
                "price": i.price,
            }
            for i in items
        ],
    }


@router.put("/users/{user_id}/cart")
def admin_update_user_cart(
    user_id: int,
    payload: AdminCartUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.flush()

    # clear and replace
    db.query(Cartitems).filter(Cartitems.cart_id == cart.id).delete()

    for item in payload.items:
        product = db.query(Products).filter(Products.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product not found: {item.product_id}")
        db.add(
            Cartitems(
                cart_id=cart.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price,
            )
        )

    db.commit()
    return {"success": True, "user_id": user_id, "cart_id": cart.id}

