import { useMutation } from "@tanstack/react-query"
import { Deleteitem } from "../../api/cart.api"
export default function removeCartItem(){
    return useMutation({
    mutationFn: Deleteitem,
    
})}