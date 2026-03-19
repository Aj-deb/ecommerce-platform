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
        <nav>
            <Link to ="/">Home</Link>
            <Link to ="/Dashboard">Dashboard</Link>
        </nav>
        <h1>Dashboard {user["sub"]}</h1>
        <button onClick={()=>navigate("/Cart")}>Cart</button>
        <button onClick={()=>navigate("/Orderpage")}>Orders</button>
        <Products/>
        
        </>
    )
}
export default Dashboard