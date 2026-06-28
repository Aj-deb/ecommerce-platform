import { useMutation } from "@tanstack/react-query"
import { mergeCart } from "../../api/cart.api"
export default function mergeCartMutation(){
    return useMutation({
    mutationFn: mergeCart,
    onSuccess:()=>{
        localStorage.removeItem("guest_cart_id")
    }
})}