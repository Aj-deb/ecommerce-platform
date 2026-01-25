import React from "react";
import useAuth from "../Context/AuthContext";
import { Link } from "react-router-dom";
const Dashboard=()=>{
    const {user} = useAuth()
    return (
        <>
        <nav>
            <Link to ="/">Home</Link>
            <Link to ="/Dashboard">Dashboard</Link>
        </nav>
        <h1>Dashboard {user["sub"]}</h1>

        </>
    )
}
export default Dashboard