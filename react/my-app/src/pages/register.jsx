import React, { useEffect, useState } from "react";
import loginUser from "../api/Auth.api"
import useAuth from "../Context/AuthContext";
import { useNavigate,Link } from "react-router-dom";
import {createUser} from "../api/Auth.api"

const Register =()=>{
    // const {Validation} =useAuth
    const navigate = useNavigate()
    const {Validation} = useAuth
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] =useState("")
    const [number,setNumber] = useState("")
    const [loading,setLoading] = useState(false)
    const [errors,setErrors] = useState({})

    async function handleSubmit(e){
        e.preventDefault()
        try{
            const res = await createUser({email,name,password})
            if(res.response.ok){
                console.log("Registered Successfully");
            }
        }
        catch(err){
            if(err.response.status == 403){
                return setErrors({
                    "exist":"Email already created"
                })
            }
            // console.log(err || "Registration Failed") 
            const NewErrors  = Validation(err)
            setErrors(NewErrors) 
        }
        finally{
            setLoading(false)
            navigate("/Dashboard")
        }
    }
    return (
        <>
        <div className=" min-h-screen bg-gray-100 flex justify-center pt-10">
            <div className="bg-gray-400 ">
                <div>
                    <h3 className="text-xl font-bold">Create Account</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <p>Phone number :
                    <input className="ml-2" placeholder="Phone number"/>
                    </p>
                    <br/>
                    <p>Name</p>
                    <input onChange={(e)=>{setName(e.target.value)}} type="name" placeholder="Enter the Name" className="m-1"/>
                    <br/>
                    <p>Email</p>
                    <input onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Enter the Name" className="m-1"/>
                    <br/>
                    <p>Password</p>
                    <input onChange={(e)=>{setPassword(e.target.value)}} className="ml-1" placeholder="enter the password" type="password"/>
                    <p>
                        <small>{errors.password}</small>
                    </p>
                    {errors.exist}
                    <button  disabled= {loading} type="submit" className="block m-auto mt-10 bg-slate-800">
                        {loading ? "Registering.." :"Register"}
                    </button>
                    <p>
                        Already a user?
                        <Link to="/">login</Link>
                    </p>
                </form>
            </div>
        </div>
        </>

    )

}
export default Register