// src/pages/OrderConfirmed.jsx
import { useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Home,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { specificOrder } from "../api/order.api";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <Clock size={16} />,
    progress: 10,
    message: "Your order is waiting for confirmation.",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: <Package size={16} />,
    progress: 50,
    message: "We’re preparing your items for shipment.",
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <Truck size={16} />,
    progress: 75,
    message: "Your package is on the way.",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <Home size={16} />,
    progress: 100,
    message: "Your order has been delivered.",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <Clock size={16} />,
    progress: 100,
    message: "This order has been cancelled.",
  },
};

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => specificOrder(id),
    enabled: !!id,
  });

  const order = data || {};
  const items = order?.items || [];
  const address = order?.shipping_address || {};

  const currentStatus = useMemo(() => {
    return statusConfig[order?.status] || statusConfig.PENDING;
  }, [order?.status]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-10">Loading...</div>
      </>
    );
  }

  if (isError || !order?.id) {
    return (
      <>
        <Navbar />
        <div className="p-10">Order not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>

                  <h1 className="text-2xl font-bold text-slate-900">
                    Order Placed Successfully
                  </h1>

                  <p className="mt-2 text-sm text-slate-600">
                    Thank you for your purchase.
                  </p>
                </div>

                <div
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${currentStatus.color}`}
                >
                  {currentStatus.icon}
                  {currentStatus.label}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-100 p-4">
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>Order Progress</span>
                  <span>{currentStatus.progress}%</span>
                </div>

                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{ width: `${currentStatus.progress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  {currentStatus.message}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Order Items</h2>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border p-3"
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium">{item.product_name}</h3>
                      <p className="text-sm text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span>{order.id}</span>
                </div>

                <div className="flex justify-between">
                  <span>Placed On</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Payment</span>
                  <span>{order.payment_method}</span>
                </div>

                <hr />

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${Number(order.shipping_fee).toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Shipping Address</h2>

              <div className="mt-4 text-sm leading-7">
                <p className="font-medium">{address.name}</p>
                <p>{address.phone}</p>
                <p>{address.line1}</p>
                <p>{address.line2}</p>
                <p>
                  {address.city}, {address.state}
                </p>
              </div>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => navigate("/Dashboard")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Continue Shopping <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}