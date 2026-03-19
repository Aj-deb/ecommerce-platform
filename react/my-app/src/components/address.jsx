import { useState, React } from "react";
import { Mutation, useMutation,useQuery } from "@tanstack/react-query";
import Button from "./button";
import fetchAddress, { updateAddress } from "../api/shipping.api";
import { Navigate, useNavigate } from "react-router-dom";
export default function Address({ data ,setEdit}) {
    const navigate =useNavigate()
    const [selectedId,setId] =useState(null)
    const { refetch } = useQuery({
    queryKey: ['address'],
    queryFn: fetchAddress,
    enabled: false // important (won't run automatically)
    });
    const mutation =useMutation({
        mutationFn:updateAddress,
        onSuccess:(data) =>{
            refetch();//call get api
            setEdit(false)
        },
        onError: (error) => {
        console.log("Error", error);
        }
    });
    function handleSelect(id){
        setId(id)
    }
    function selectAddress(selectedId){
        mutation.mutate(selectedId)

    }
    return (
        <>
            <div className="divide-y border-b">
                {
                    data?.Info.map((i) => (
                        <div className="flex m-4 items-center min-h-auto" key={i?.id}>
                            <input id={`address-${i.id}`} type="checkbox"
                                onChange={()=>handleSelect(i.id)}
                                checked={selectedId === i.id}
                                className=" 
                                    w-5 h-5 rounded-full border-2 border-purple-500 appearance-none
                                    checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-600
                                    checked:border-purple-600 relative
                                    after:content-[''] after:absolute after:top-[4px] after:left-[4px]
                                    after:w-[8px] after:h-[8px] after:bg-white after:rounded-full
                                    after:scale-0 checked:after:scale-100 after:transition-all
                                    "
                            />
                            <label htmlFor={`address-${i.id}`} class="ms-2 text-sm font-medium">
                                <p className="text-sm font-medium text-gray-700">{i.house_no}</p>
                                <p className="text-sm font-medium text-gray-700">Street No.{i?.street_no}</p>
                                <p className="text-sm font-medium text-gray-700 ">{i?.location},{i?.landmark}</p>
                                <p className="text-sm font-medium text-gray-700">{i?.city},{i?.state}</p>
                            </label>
                        </div>

                    ))
                }
            </div>
        <Button onClick ={()=>selectAddress(selectedId)} type={"submit"} className={"ml-4 rounded-2xl w-auto h-12 text-[16px] "}>Continue with Address</Button>

        </>
    )
}