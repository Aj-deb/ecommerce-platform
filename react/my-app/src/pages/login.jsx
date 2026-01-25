import React, { useEffect, useState } from "react";
import useAuth  from "../Context/AuthContext";
import { useNavigate,Link } from "react-router-dom";
import loginUser from "../api/Auth.api"
import Register from "./register";

const Login =()=>{
    const navigate = useNavigate();
    const {Validation} = useAuth
    const {decodeToken,user,setUser} = useAuth()
    const [email,setEmail] = useState("")//aarnj@gmail
    const [password,setPassword] =useState("")
    const [errors,setErrors] = useState({})
    const [loading,setLoading] = useState(false)
   
    const handleSubmit = async(e) =>{
        e.preventDefault()
        setLoading(true)
        try{
            const token = await loginUser({email,password})
            const data = token.data.access_Token
            const userdata = decodeToken(data)//payload
            setUser(userdata)
            navigate("/Dashboard")
            }
        catch(error){
                if(error.response.status == 403){
                    return setErrors({"general":"Invalid credentials"})
                }
                const NewErrors  = Validation(error)
                setErrors(NewErrors) 
                console.log(errors);              
        } //  const response = await api.post("/users/login/",data)
        finally{
            setLoading(false)
        }
        
}  
    return (
        <>
        <div className="flex  items-center justify-center h-screen">
                <form onSubmit = {handleSubmit}>
                <p>Email</p>
                <input type="email" onChange = {(e)=>setEmail(e.target.value)} name = "email" placeholder="Enter the email"  />
                <p >Password</p>
                <input onChange = {(e)=>setPassword(e.target.value)} name = "password" placeholder="Enter the password"/>
                <p>{errors.password}</p>
                <pre>{errors.general}</pre>  
                <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition" disabled = {loading} type ="submit">
                    {loading ? "loading...": "login"}
                </button>
                <p>Already a User ? {<Link to="/Register" className="text-blue-500">Register</Link>}</p>
                </form>
           </div>
        </>
    )
}
export default Login

