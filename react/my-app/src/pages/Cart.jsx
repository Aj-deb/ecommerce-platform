import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import fetchCart, { decreased, increased } from "../api/cart.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../components/button";

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cartitems"],
    queryFn: fetchCart,
  });

  const cartItems = data?.data?.items || [];

  const increaseItem = useMutation({
    mutationFn: (product_id) => increased(product_id),

    onMutate: async (product_id) => {
      setUpdatingId(product_id);

      await queryClient.cancelQueries({ queryKey: ["cartitems"] });

      const previousCart = queryClient.getQueryData(["cartitems"]);

      queryClient.setQueryData(["cartitems"], (old) => {
        if (!old?.data?.items) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((item) =>
              item.product.id === product_id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          },
        };
      });

      return { previousCart };
    },

    onError: (_err, _product_id, context) => {
      queryClient.setQueryData(["cartitems"], context.previousCart);
    },

    onSettled: () => {
      setUpdatingId(null);
      queryClient.invalidateQueries({ queryKey: ["cartitems"] });
    },
  });

  const decreaseItem = useMutation({
    mutationFn: (product_id) => decreased(product_id),

    onMutate: async (product_id) => {
      setUpdatingId(product_id);

      await queryClient.cancelQueries({ queryKey: ["cartitems"] });

      const previousCart = queryClient.getQueryData(["cartitems"]);

      queryClient.setQueryData(["cartitems"], (old) => {
        if (!old?.data?.items) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items
              .map((item) =>
                item.product.id === product_id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
              .filter((item) => item.quantity > 0),
          },
        };
      });

      return { previousCart };
    },

    onError: (_err, _product_id, context) => {
      queryClient.setQueryData(["cartitems"], context.previousCart);
    },

    onSettled: () => {
      setUpdatingId(null);
      queryClient.invalidateQueries({ queryKey: ["cartitems"] });
    },
  });

  const handleShipping = () => {
    if (cartItems.length === 0) return;
    navigate("/Shipping");
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-10">Loading...</div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="p-10">Failed to load cart</div>
      </>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.product.price),
    0
  );

  return (
    <>
      <Navbar />

      <div className="w-full bg-gray-50 min-h-screen px-4 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
          {/* Left */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-semibold mb-4">Your Items</h1>

            <div className="grid grid-cols-[1fr_120px] border-b pb-2 text-gray-500 text-sm">
              <span>Items</span>
              <span className="text-right">Quantity</span>
            </div>

            <div className="divide-y">
              {cartItems.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <p className="text-gray-400 text-xl">Your Cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid grid-cols-[1fr_120px] py-4 items-center"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.product.url}
                        className="w-24 h-24 object-contain bg-gray-100 rounded-lg"
                        alt={item.product.name}
                      />

                      <div className="flex m-4 flex-col">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-indigo-600 font-semibold">
                          ${Number(item.product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => decreaseItem.mutate(item.product.id)}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                          disabled={updatingId === item.product.id}
                        >
                          -
                        </button>

                        <span className="px-3">{item.quantity}</span>

                        <button
                          onClick={() => increaseItem.mutate(item.product.id)}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                          disabled={updatingId === item.product.id}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm mb-2">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>Total</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleShipping}
              disabled={cartItems.length === 0}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Buy
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;