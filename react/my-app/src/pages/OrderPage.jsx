import React, { useEffect, useState } from "react";
import useAuth from "../Context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { getOrder } from "../api/order.api"
import OrderDetali from "./OrderDetail"
import Navbar from "../components/Navbar";
const Orderpage = () => {
    const navigate = useNavigate()
    const [Orders, setOrders] = useState(null)

    useEffect(() => {
        const handleOrder = async () => {
            const orderlist = await getOrder()
            setOrders(orderlist.data)
            console.log(orderlist.data);
        }
        handleOrder()
    }, [])
    const handleitem = (id) => {
        console.log(typeof id);
        navigate(`/SpecifiedOrder/${id}`)
    }
    return (
        <>
            <Navbar />
            <div class="w-full bg-indigo-50 min-h-screen px-6 lg:px-64 grid grid-cols-1 items-start gap-6 ">
                <div className="w-full mt-4 p-6 rounded-md bg-white ">
                    <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold ">Your Orders</h1>
                    <div className="border-b  grid grid-cols-[1fr_120px] p-2 font-medium">
                        {Orders?.map(order => (
                            <div
                                key={order.order_id}
                                onClick={() => handleitem(order.order_id)}
                                className="bg-red-500 p-3 mb-4"
                            >
                                <p>Order ID: {order.order_id}</p>
                                <p>Status: {order.status}</p>
                            </div>
                        ))}
                    </div>
                    <div className="divide-y  border-[#E8EF23] rounded-md ">
                        {Orders?.length <= 0 && (
                            <div className=" flex justify-center items-center py-20">
                                <p className="font-bold text-[16px] sm:text-[24px] lg:text-[32px] text-gray-500">
                                    Your Orders is Empty
                                </p>
                            </div>
                        )}
                       


                    </div>
                </div>
            </div>

        </>
    )
}
export default Orderpage

