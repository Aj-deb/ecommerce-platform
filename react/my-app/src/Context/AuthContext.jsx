import React, { useEffect, useContext } from "react";
import { useState, createContext } from "react";
import { jwtDecode } from "jwt-decode"
import { useNavigate, Navigate } from "react-router-dom";

const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const Validation = (error) => {
        console.log(error)
        const fieldErrors = {}
        if (error.response?.data?.detail) {
            error.response.data.detail.forEach(err => {
                fieldErrors[err.loc[1]] = err.msg
            })
        }
        return fieldErrors
    }
    // const value = {
    //     user,
    //     setUser,
    //     isAuthenticated:!!user
    // }
    // useEffect(()=>{
    //     const data = localStorage.getItem("token")
    //     const payload1 = jwtDecode(data)
    //     setUser(payload1)
    // },[])
    // const login = () => {
    //     try {
    //         const token = await loginUser({ email, password })
    //         const data = token.data.access_Token
    //         const userdata = decodeToken(data)//payload
    //         setUser(userdata)
    //         navigate("/")
    //     }
    //     catch (error) {
    //         if (error.response.status == 403) {
    //             return setErrors({ "general": "Invalid credentials" })
    //         }
    //         const NewErrors = Validation(error)
    //         setErrors(NewErrors)
    //         console.log(errors);
    //     } //  const response = await api.post("/users/lLgin/",data)
    //     finally {
    //         setLoading(false)
    //     }
    // }
    const decodeToken = (newToken) => {
        localStorage.setItem("token", newToken)
        const payload = jwtDecode(newToken)
        return payload
    }
    const logout = () => {
        localStorage.removeItem("token")
        return <Navigate to="/" replace />
    }
    return (
        <>
            <AuthContext.Provider value={{ Validation, decodeToken, user,setUser,isAuthenticated:!!user }}>
                {children}
            </AuthContext.Provider>
        </>

    )
}
const useAuth = () => {
    return useContext(AuthContext)
}

export default useAuth