import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrder } from "../api/order.api";
import Navbar from "../components/Navbar";

const Orderpage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const handleOrder = async () => {
      try {
        const res = await getOrder();
        setOrders(res.data || []);
      } catch (error) {
        setOrders([]);
      }
    };

    handleOrder();
  }, []);

  const handleItem = (id) => {
    navigate(`/SpecifiedOrder/${id}`);
  };

  return (
    <>
      <Navbar />

      <div className="w-full bg-gray-50 min-h-screen px-4 py-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>

          {orders.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-400 text-lg">You have no orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  onClick={() => handleItem(order.order_id)}
                  className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-800">#{order.order_id}</p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        order.status === "DELIVERED"
                          ? "text-green-600"
                          : order.status === "PENDING" ||
                            order.status === "PROCESSING"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.status}
                    </p>

                    <p className="text-xs text-gray-400">
                      Click to view details
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orderpage;