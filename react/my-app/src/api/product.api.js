import api from "./axios"

const products = async(data) =>{
    try{
        const response = await api.post("/Products",data)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
const specificProducts = async(id,data) =>{
    try{
        const response = await api.post(`/Products/${id}`,data)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export default Products