import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import fetchCart from "../api/cart.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../components/button";
import getGuestCartId from "../utilis/guestCart";
import useAuth from "../Context/AuthContext";
import { useRef } from "react"
import useCartUpdation from "../hooks/cart/useUpdationCart"
  
const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);
  const guestCartId = getGuestCartId()
  const {user,isAuthenticated} = useAuth()
  const [newQty,setNewQty] = useState(null)
  const updateCart = useCartUpdation()
  let timer = useRef(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cartitems",guestCartId],
    queryFn: ()=>fetchCart(guestCartId),
  });
 console.log(isAuthenticated);
  const cartItems = data?.data || []
  const increaseItem = useMutation({
    mutationFn: (product_id) => increased(product_id),
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

  const guest_cart_id = localStorage.getItem("guest_cart_id")
  const handlequantitychange =(product_id,newQty)=>{
      queryClient.setQueryData(
        ["cartitems", guestCartId],
        (old) => {
            if (!old) return old
            if (newQty < 0){
                removeCartItem.mutate({
                guest_cart_id,
                product_id,
            });
            return;
            }
            return {
                ...old,
                data: old.data.map((item) =>
                    item.product_id === product_id? { ...item, quantity: newQty }: item
                  
              )
            }
        }
    )
      setNewQty(newQty)
      clearTimeout(timer.current)
  
      timer.current = setTimeout(()=>{
          updateCart.mutate({
              guest_cart_id,
              product_id,
              quantity : newQty
          })
      },1000)
  }
  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
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
                    key={item.id}
                    className="grid grid-cols-[1fr_120px] py-4 items-center"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.url}
                        className="w-24 h-24 object-contain bg-gray-100 rounded-lg"
                        alt={item.name}
                      />

                      <div className="flex m-4 flex-col">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-indigo-600 font-semibold">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handlequantitychange(item.product_id,item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                          
                        >
                          -
                        </button>

                        <span className="px-3">{item.quantity}</span>

                        <button
                          onClick={() => handlequantitychange(item.product_id,item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
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
              
              disabled={cartItems.length === 0 }
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
             {isAuthenticated ?"Proceed to Buy":"Login to Proceed"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;