import React, { useEffect, useState } from "react";
import useAuth  from "../Context/AuthContext";
import { useNavigate,Link } from "react-router-dom";
import loginUser from "../api/Auth.api"
import  AuthLayout  from "../Context/Authlayout";
import Fields from "../components/input";
import Button from "../components/button";
import Leftside from "../components/leftcomponet";

const Login =()=>{
    const navigate = useNavigate();
    const {Validation,decodeToken,user,setUser} = useAuth()
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
        } //  const response = await api.post("/users/lLgin/",data)
        finally{
            setLoading(false)
        }
}  
    return (
    <>
        <AuthLayout left={
            <Leftside
            title={<>Welcome to<span className="block">BMART</span></>}
            subtitle="Shopping is easy, that mom loves to buy"
            buttontext="Join Us"
            onClick={() => navigate("/Register")}
            />
            }
        >
        <div>
            <h1 className="text-3xl font-semibold mt-16 mb-0 m-14">Login</h1>
            <form onSubmit = {handleSubmit}>
                <div className="text-sm font-medium text-gray-600 mt-8 m-14">
                    <p>Email</p>
                    <Fields type="email" onChange = {(e)=>setEmail(e.target.value)} name = "email" placeholder="Enter the email" />
                    {errors.email}
                    
                    <p className="mt-4">Password</p>
                    <Fields  onChange = {(e)=>setPassword(e.target.value)} name = "password" placeholder="Enter the password"/>
                    <p>{errors.password}</p>

                    <pre>{errors.general}</pre>  

                    <Button className="w-full" disabled = {loading} type ="submit">
                        {loading ? "loading...": "login"}
                    </Button>
                    <p className="text-sm font-semibold mt-4 flex justify-center">Don't have an account ?{<Link to="/Register" className="text-blue-500 px-1" >Sign up</Link>}</p>
                </div>
            </form>
        </div>
        </AuthLayout>
     </>
    )
}
export default Login

