import fetchCart from "../../api/cart.api"
import { useQuery, useMutation } from "@tanstack/react-query"

export default function useFetchCart(){
    return useMutation({
        MutationFn: fetchCart
    })
}
