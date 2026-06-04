import api from "./axios";
const Orderplaced = async(id) =>{
    try{
        const response = await api.post(`/orders/create/${id}`)
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
export const specificOrder = async(order_id) =>{
    try{
        const id = Number(order_id);
        if (Number.isNaN(id)) {
            throw new Error(`Invalid order_id: ${order_id}`);
        }
        const response = await api.get(`/orders/${id}`)
        return response.data
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export default Orderplaced
