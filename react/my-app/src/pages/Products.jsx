import React, { useEffect, useState } from "react";
import useAuth  from "../Context/AuthContext";
import { useNavigate,Link } from "react-router-dom";
import  fetchProducts from "../api/product.api";
import {useQuery,useMutation} from "@tanstack/react-query"
import Button from '../components/button'
import { AddToCart } from "../api/cart.api";
const Products = () =>{
    const [page,setPage] = useState(1)
    const [limit,setLimit] = useState(10)

    const {data,refetch,isLoading,error}  = useQuery({
            queryKey:["products",{limit,page}],
            
            queryFn:({queryKey:[_,params]}) => {
                console.log("params",params)
                return fetchProducts(params)
            },
            refetchOnWindowFocus:true
    })

    const addCartMutation  = useMutation({
        mutationFn : AddToCart,
        onSuccess : ()=>{queryClient.invalidateQueries(["cart"])}
    })

    if(isLoading) return <h1 className="m-auto">Loading...</h1>
    if(error) return <p>Error</p>
    console.log(data)
    console.log(data.data.url)
    return (
        <>
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6  " >
                {data?.data?.map(prod => (
                        <div key = {prod.id} className="min-w-42 h-128 mt-1 border rounded-xl p-4 shadow hover:shadow-lg transition-64 ">
                            <img src={prod.url}
                                className="h-40 w-40 object-cover m-auto rounded-lg"
                            /> 
                            <h2 className="text-lg font-semibold mt-2">{prod.name}</h2>
                            <p className="text-gray-700">{prod.price}</p>
                            <Button onClick={()=>addCartMutation.mutate(
                                {
                                    product_id:prod.id
                                }
                            )}>Add to cart</Button>
                        </div>  
                    ))
                }
            </div>
        </div>
        </>
    )
}

export default Products