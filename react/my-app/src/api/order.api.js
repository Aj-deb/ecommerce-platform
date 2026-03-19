import api from "./axios";
const Orderplaced = async() =>{
    try{
        const response = await api.post("/orders/create")
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const getOrder = async() =>{
    try{
        const response = await api.get("/orders/")
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const specificOrder = async(item_id) =>{
    try{
        const response = await api.get(`/orders/${item_id}`)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export default Orderplaced