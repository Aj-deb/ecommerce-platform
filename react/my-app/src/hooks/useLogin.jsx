import { useMutation } from "@tanstack/react-query"
import loginUser, { createUser } from "../api/Auth.api"
import Login from "../pages/login"
import useAuth from "../Context/AuthContext"
import { useNavigate } from "react-router-dom"
import Orderpage from "../pages/OrderPage"
import mergeCartMutation from "./cart/usemergeCart"
export default function useLogin(){
    const guest_cart_id = localStorage.getItem("guest_cart_id")
    const cartMerge = mergeCartMutation()
    const navigate = useNavigate()
    const {Validation,setUser,decodeToken} = useAuth()
     return useMutation({ 
            mutationFn:loginUser,
            onSuccess : async (response) =>{
                const token = response.data.access_Token
                localStorage.setItem("token",token)
                const userdata = await decodeToken(token)//payload
                setUser(userdata)
                if (guest_cart_id){
                cartMerge.mutate(guest_cart_id)
                }
                    
               }

        })
}
