import React from "react"
import Button from "../button"
import useFetchCart from "../../hooks/cart/fetchcart"
import { useNavigate } from "react-router-dom"
export default function ProductButton(){
    const FetchCart = useFetchCart()
    const navigate = useNavigate()
    return(
        <> 
        {/* for mobile */}
            {/* <div className="flex p-1 sticky bottom-0 top-0 w-full">
                <Button onClick={()=>navigate("/Cart")} className=" flex p-0 m-auto text-center border-2  w-1/10 rounded-md"><span>Mycart</span></Button>
                <Button className=" flex border-2 m-auto  w-1/2 rounded-md"><span className="m-auto">Add to cart</span></Button>
                <Button className=" flex border-2 text-center w-1/2 rounded-md"><span className="m-auto">Buy now</span></Button>
            </div> */}
            <div className="flex ">
                <Button className=" flex border-2  w-1/4 rounded-md"><span className="m-auto">Add to cart</span></Button>
                <Button className=" flex border-2 text-center w-1/4 rounded-md"><span className="m-auto">Buy now</span></Button>
            </div>    
        </>
    )
}