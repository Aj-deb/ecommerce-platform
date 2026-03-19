import React, { useEffect, useState } from "react";
import useAuth from "../Context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { createUser } from "../api/Auth.api"
import AuthLayout from "../Context/Authlayout";
import Leftside from "../components/leftcomponet";
import Fields from "../components/input";
import Button from "../components/button";

const Register = () => {
    const navigate = useNavigate()
    const { Validation } = useAuth()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [number, setNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [confirmpassword,setConfirmPassword] =useState("")
    async function handleSubmit(e) {
        e.preventDefault()
        if( confirmpassword != password){
            return setErrors({
                "Matched":"Passwords do not match"
            })
        }
        try {
            const res = await createUser({ email, name, password ,confirmpassword})
            if (res.status == 201 || 200) {
                console.log("Registered Successfully");
                navigate("/Dashboard")
            }
        }
        catch (err) {
            if (err.response?.status == 403) {
                return setErrors({
                    "exist": "Email already created"
                })
            }
            // console.log(err || "Registration Failed") 
            const NewErrors = Validation(err)
            setErrors(NewErrors)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <AuthLayout left={
                <Leftside
                    title={<>Join BMART</>}
                    subtitle="Register to make shopping easy"
                    buttontext={null}
                />
            }
            >
                <div >
                    <h3 className="text-3xl font-semibold mt-16 mb-0 m-14">Create Account</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="text-md font-medium text-gray-600 mt-8 m-14">
                            <p >Name</p>
                            <Fields type="name" onChange={(e) => setName(e.target.value)} name="name" placeholder="Enter the Name" />

                            <p className="mt-4">Email</p>
                            <Fields type="email" onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Enter the email" />
                            {errors.email}

                            <p className="mt-4">Password</p>
                            <Fields onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter the password" />
                            <p>{errors.password}</p>

                            <p className="mt-4">Confirm Password</p>
                            <Fields onChange={(e) => setConfirmPassword(e.target.value)} name="password" placeholder="Confirm the password" />
                            <p className="mt-1 text-red-400">{errors.Matched}</p>

                            <pre>{errors.general}</pre>

                            <Button name="Login" disabled={loading} type="submit" >
                                {loading ? "loading..." : "login"}
                            </Button>

                            <p className="text-sm font-semibold mt-4 flex justify-center">Already a user ?{<Link to="/" className="text-blue-500 px-1" >Login</Link>}</p>
                        </div>
                    </form>
                </div>
            </AuthLayout>
        </>

    )

}
export default Register