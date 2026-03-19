import React from "react";
import useAuth from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Products from "./Products";
import Orderpage from "./OrderPage";
import Navbar from "../components/Navbar";
const Dashboard=()=>{
    const navigate = useNavigate()
    const {user} = useAuth()
    return (
        <>
        <Navbar/>
        <Products/>
        </>
    )
}
export default Dashboard