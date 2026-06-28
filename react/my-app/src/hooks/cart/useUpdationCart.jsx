import { useMutation } from "@tanstack/react-query"
import { CartUpdation } from "../../api/cart.api"
export default function useCartUpdation(){
    return useMutation({
    mutationFn: CartUpdation,
})}