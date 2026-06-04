import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { specificOrder } from "../api/order.api";

const SpecifiedOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        async function handleOrder(orderId) {
            const data = await specificOrder(orderId);
            setOrder(data);
        }
        handleOrder(id);
    }, [id]);

    if (!order) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-medium animate-pulse">Loading Order...</p>
            </div>
        );
    }

    const statusColor = {
        PENDING: "bg-yellow-100 text-yellow-700",
        PROCESSING: "bg-yellow-100 text-yellow-700",
        DELIVERED: "bg-green-100 text-green-700",
        COMPLETED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    const normalizedStatus = String(order.status || "").toUpperCase();

    const totalPrice = order.items?.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity || 1),
        0
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            Order #{order.id}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Order Details Summary
                        </p>
                    </div>

                    <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                            statusColor[normalizedStatus] || "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {normalizedStatus || order.status}
                    </span>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Items</h3>

                <div className="space-y-4">
                    {order.items?.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border-b pb-3"
                        >
                            <div>
                                <p className="font-medium">{item.product_name}</p>
                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity || 1}
                                </p>
                            </div>

                            <p className="font-semibold text-lg">
                                ${item.price}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Price Details</h3>

                <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>${Number(totalPrice || 0).toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between">
                        <p>Delivery Fee</p>
                        <p>$50</p>
                    </div>

                    <div className="flex justify-between font-semibold text-lg border-t pt-3">
                        <p>Total</p>
                        <p>${(Number(totalPrice || 0) + 50).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecifiedOrder;
