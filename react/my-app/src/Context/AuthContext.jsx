import React, { useEffect, useContext } from "react";
import { useState,createContext } from "react";
import {jwtDecode} from "jwt-decode"
import {useNavigate,Navigate}  from "react-router-dom";

// const navigate = useNavigate();
const AuthContext = createContext()//factory =>bluepirnt
export const AuthProvider=({children})=>{
    const [user,setUser] =useState({})
    const Validation=(error)=>{
        console.log(error)
        const fieldErrors = {}
            if(error.response?.data?.detail){
                error.response.data.detail.forEach(err=>{
                fieldErrors[err.loc[1]] = err.msg
            })
        }
        return fieldErrors
    }
    useEffect(()=>{
        const data = localStorage.getItem("token")
        if(!data){
            return console.log("no token");
        }
        const payload1 = jwtDecode(data)
        console.log(payload1);
        setUser(payload1)
    },[])
    const decodeToken = (newToken)=>{
        localStorage.setItem("token",newToken)
        const payload =  jwtDecode(newToken)
        console.log(payload);
        return payload
    }
    const logout =() =>{
        localStorage.removeItem("token")
        return <Navigate to="/" replace/>
    }

    return (
        <>
            <AuthContext.Provider value ={{Validation,decodeToken,user,setUser}}>
                {children}
            </AuthContext.Provider>
        </>

    )
}
const useAuth =() => {
    return useContext(AuthContext) 
 }

export default useAuth