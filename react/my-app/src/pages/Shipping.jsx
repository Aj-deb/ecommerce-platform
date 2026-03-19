import React from "react";
import { useState, useEffect } from "react";
import fetchAddress from "../api/shipping.api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Fields from "../components/input";
import Button from "../components/button";
import { useQuery } from "@tanstack/react-query";
import Address from "../components/address";
const Shipping = () => {
    const [editaddress, setEdit] = useState(true)
    const { data, isLoading, error } = useQuery({
        queryKey: ["address"],
        queryFn: fetchAddress,
    })
    const selectedAddress = data?.Info?.find(addr=>addr.is_default === true) || data?.Info[0]
    function handleEdit() {
        console.log("hello i am here");
        setEdit(!editaddress)
    }
    console.log("the ashippin gpart",data);
    return (
        <>
            <Navbar />
            <div class="w-full min-h-screen bg-indigo-50">
                <main class="max-w-* mx-auto  py-4 sm:px-4 md:px-4 lg:px-6">
                    <div class="grid grid-cols-1 grid-rows-1  md:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:grid-cols-[2fr_1fr] gap-1 lg:gap-4 ">
                        <div class="flex justify-between w-full h-auto p-4 bg-white rounded-sm ">
                            <div class="flex flex-col text-lg sm:text-xl lg:text-3xl font-semibold gap-1">
                                Shipping Address
                                <span className="flex "></span>
                                {/* <p className="text-sm  ">{data.first_name}</p>
                                <p className="text-sm  ">Hno6</p>
                                <p className="text-sm  ">StreetNO</p>
                                <p className="text-sm  ">StreetNO</p> */}
                                {editaddress?
                                    <div className=" min-h-auto" key={selectedAddress?.id}>
                                        <p className="text-sm font-medium text-gray-700">{selectedAddress?.house_no}</p>
                                        <p className="text-sm font-medium text-gray-700">Street No.{selectedAddress?.street_no}</p>
                                        <p className="text-sm font-medium text-gray-700 ">{selectedAddress?.location},{selectedAddress?.landmark}</p>
                                        <p className="text-sm font-medium text-gray-700">{selectedAddress?.city},{selectedAddress?.state}</p>
                                    </div>
                                    :
                                    <Address data={data} setEdit={setEdit}/>
                                }
                            </div>
                            <button onClick={handleEdit} className="flex items-start ">Change the address</button>

                        </div>
                        <div class="w-full divide-y border-b bg-white rounded-sm p-4 flex flex-col gap-2 ">
                            <h1 className="text-lg font-semibold">Order Summary</h1>
                            <div className="flex flex-col gap-1">
                                <p className="text-md font-semibold ">Subtotal</p>
                                <p className="text-sm">items:</p>
                                <p className="text-sm">Delivery:</p>
                            </div>
                            <div className="w-full  bg-white rounded-sm ">
                                <p className="text-lg font-semibold">Total:</p>
                                <Button className="min-w-full text-lg font-semibold">Make payment</Button>
                            </div>
                        </div>

                        <div class="w-full relative bg-white rounded-sm p-4 gap-0">
                            <span>Discount Code:</span>
                            <Fields placeholder={"Coupon Code"}></Fields>
                            <Button type={"button"} className={"absolute lg:w-1/4 right-4 top-12 -translate-y-1/2   rounded-md"}>Apply</Button>
                        </div>
                    </div>
                </main>
            </div>

        </>
    )
}
export default Shipping
