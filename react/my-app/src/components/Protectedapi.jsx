import React from "react";
import {useEffect} from "react"
import { Navigate, useNavigate } from "react-router-dom";
const ProtectedRoute = ({children})=>{
    const token = localStorage.getItem("token")
    if(!token){
        return <Navigate to = "/" replace/>
    }
    return children;
}
export default ProtectedRoute