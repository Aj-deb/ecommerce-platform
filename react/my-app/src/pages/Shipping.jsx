// src/pages/Shipping.jsx
import React, { useState } from "react";
import fetchAddress, { addAddress } from "../api/shipping.api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Fields from "../components/input";
import Button from "../components/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Address from "../components/address";
import fetchCart from "../api/cart.api";
import Orderplaced from "../api/order.api";
import useAuth from "../Context/AuthContext";

const Shipping = () => {
  const [editaddress, setEdit] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const {isAuthenticated} =useAuth()
  const [formData, setFormData] = useState({
    first_name: "",
    second_name: "",
    phone_no: "",
    house_no: "",
    street_no: "",
    landmark: "",
    location: "",
    city: "",
    state: "",
    address_type: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, error } = useQuery({
    queryKey: ["address"],
    queryFn: fetchAddress,
  });

  const { data: data1 } = useQuery({
    queryKey: ["cartitems"],
    queryFn: fetchCart,
  });

  const addressCreate = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      setShowAddressModal(false);
      setEdit(true); 
      setFormData({
        first_name: "",
        second_name: "",
        phone_no: "",
        house_no: "",
        street_no: "",
        landmark: "",
        location: "",
        city: "",
        state: "",
        address_type: "",
      });
    },
  });

  const orderCreate = useMutation({
    mutationFn: (id) => Orderplaced(id),
    onSuccess: (res) => {
      const orderId = res?.data?.order_id || res?.order_id;
      navigate(`/OrderConfirmationPage/${orderId}`);
    },
  });

  const cartItems = data1?.data?.items || [];

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.product.price),
    0
  );

  const selectedAddress =
    data?.Info?.find((addr) => addr.is_default === true) || data?.Info?.[0];

  const handleEdit = () => {
    setEdit(!editaddress);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveAddress = () => {
    addressCreate.mutate({
      ...formData,
      street_no: Number(formData.street_no),
      address_type: formData.address_type.toLowerCase(),
    });
  };
  const handlePlaceOrder=(data)=>{
    if (!isAuthenticated){
        navigate("/login")
    }
    orderCreate.mutate(data)
  }
  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between">
              <div className="space-y-2">
                <h1 className="text-xl font-semibold">Shipping Address</h1>

                {editaddress ? (
                  error?.response?.status === 404 || !selectedAddress ? (
                    <Button onClick={() => setShowAddressModal(true)}>
                      Add New Address
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="font-medium">
                        {selectedAddress?.first_name}{" "}
                        {selectedAddress?.second_name}
                      </p>
                      <p>{selectedAddress?.house_no}</p>
                      <p>Street No. {selectedAddress?.street_no}</p>
                      <p>
                        {selectedAddress?.location},{" "}
                        {selectedAddress?.landmark}
                      </p>
                      <p>
                        {selectedAddress?.city}, {selectedAddress?.state}
                      </p>
                      <p>{selectedAddress?.phone_no}</p>
                    </div>
                  )
                ) : (
                  <Address data={data} setEdit={setEdit} />
                )}
              </div>

              {selectedAddress && (
                <button onClick={handleEdit} className="text-blue-600 text-sm">
                  Change
                </button>
              )}
            </div>

            {/* ADDRESS MODAL */}
            {showAddressModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="absolute right-4 top-4 text-gray-500 text-xl"
                  >
                    ×
                  </button>

                  <h2 className="text-xl font-semibold mb-6">Add New Address</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Fields
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                    <Fields
                      name="second_name"
                      value={formData.second_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                    <Fields
                      name="phone_no"
                      value={formData.phone_no}
                      onChange={handleChange}
                      placeholder="Phone Number"
                    />
                    <Fields
                      name="house_no"
                      value={formData.house_no}
                      onChange={handleChange}
                      placeholder="House No"
                    />
                    <Fields
                      name="street_no"
                      value={formData.street_no}
                      onChange={handleChange}
                      placeholder="Street No"
                    />
                    <Fields
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Landmark"
                    />
                    <Fields
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
                    />
                    <Fields
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                    <Fields
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                    <Fields
                      name="address_type"
                      value={formData.address_type}
                      onChange={handleChange}
                      placeholder="Address Type (HOME / WORK)"
                    />
                  </div>

                  <Button
                    onClick={handleSaveAddress}
                    className="w-full mt-6"
                    disabled={addressCreate.isPending}
                  >
                    {addressCreate.isPending ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm mb-2">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>Delivery</span>
              <span>$5.00</span>
            </div>

            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span>${(total + 5).toFixed(2)}</span>
            </div>

            <Button
              onClick={()=>handlePlaceOrder(data1?.data?.cart_id)}
              disabled={cartItems.length === 0}
              className="w-full text-lg font-semibold disabled:opacity-50"
            >
              Make Payment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;