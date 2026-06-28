import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyUser } from "../api/Auth.api";
import useAuth from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  
  const token = localStorage.getItem("token");
  const {setUser,isAuthenticated} = useAuth()
  const {data,isLoading,isError,isSuccess} = useQuery ({
      queryKey : ['current-user'],
      queryFn : verifyUser,
      retry : false,
      enabled : !!token
      
  })
//   console.log("Token:", token);
//   console.log("DAtA",data?.data);
  useEffect(()=>{
  if (data){
    setUser(data)
  }
  },[data])

  if (!token) {
    return <Navigate to="/" replace />;
  }
  console.log("ProtectedRoute rendered");
  if (isLoading){
    return <h1>Loading</h1>
  }
  if (isError){
    localStorage.removeItem("token")
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;