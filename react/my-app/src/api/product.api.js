import api from "./axios"

const fetchProducts = async(params) =>{
    try{
        console.log("PARAMS:",params)
        const response = await api.get("/products/items",{params})
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const specificProducts = async(data) =>{
    try{
        const response = await api.post(`/products/${data.id}`,data)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export default fetchProducts
