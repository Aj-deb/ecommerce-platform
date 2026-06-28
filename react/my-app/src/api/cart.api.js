import { data } from "react-router-dom";
import api from "./axios"

const fetchCart = async(guest_cart_id) =>{
    try{
        const response = await api.get(`/carts/display/${guest_cart_id}`)
        return response.data
    }
    catch(err){
        throw err;
    }
}

export const AddToCart = async(data) =>{
    try{
        const response = await api.post(`/carts/add`,data)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const CartUpdation = async(data) =>{
    try{
        const response = await api.put("/carts/update",data)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const mergeCart = async(guest_cart_id) =>{
    try{
        const response = await api.post(`/carts/merge/${guest_cart_id}`)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const Deleteitem = async(guest_cart_id) =>{
    try{
        const response = await api.delete(`/carts/merge/${guest_cart_id}`)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export default fetchCart