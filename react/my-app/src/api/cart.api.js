import api from "./axios"

const fetchCart = async() =>{
    try{
        const response = await api.get("/carts/Viewcart")
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const AddToCart = async(data) =>{
    try{
        const response = await api.post(`/carts/Addtocart`,data)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const decreased = async(id) =>{
    try{
        const response = await api.put(`/carts/decrease/${id}`)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const increased = async(id) =>{
    try{
        const response = await api.put(`/carts/increase/${id}`)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export default fetchCart