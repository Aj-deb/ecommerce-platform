import api from "./axios"

const fetchAddress = async() =>{
    try{
        const response = await api.get("/address/")
        return response.data
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const updateAddress = async(selectedId) =>{
        const response = await api.put(`/address/${selectedId}`)
        return response.data
}
  
export default fetchAddress 
