import React, { useEffect, useState } from "react";
import useAuth  from "../Context/AuthContext";
import { useNavigate,Link, useParams } from "react-router-dom";
import {specificOrder} from "../api/order.api"
import Order from "./OrderConfirmed";

    const SpecifiedOrder = ()=>{
        let {item_id} =useParams()
        const [orders,setOrders] = useState([])
        useEffect(()=>{
            async function handleOrder(){
            console.log(item_id);
            const orders = await specificOrder(item_id)
            setOrders(orders.data)
            console.log(orders.data);
        }
        handleOrder()
        },[])    
        return (
            <>
            
            <p> {orders.order_id} 
                {orders.status}
                {console.log(orders.orderitems)}

            </p>
                {orders?.orderitems?.map(orderitem =>(
                <div key ={orderitem.id}>
                        <p>{orderitem.name} {orderitem.price}</p>
                </div>
            ))}
            </>
        )
    }
export default SpecifiedOrder
