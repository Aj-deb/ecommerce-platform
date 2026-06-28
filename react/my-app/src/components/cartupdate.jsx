import { useRef } from "react"
import useCartUpdation from "../hooks/cart/useUpdationCart"

let timer = useRef(null)
const handlequantitychange =(newQty)=>{
    const updateCart = useCartUpdation()

    clearTimeout(timer.current)

    setTimeout((newQty)=>{
        updateCart.mutate({
            product_id,
            quantity : newQty
        })
    },1000)
}