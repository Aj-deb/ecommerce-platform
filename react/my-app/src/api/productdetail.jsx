import api from "./axios";
const fetchDetail = async(data) =>{
    try{
        const response = await api.get(`/products/${data}/detail`)
        return response.data
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export default fetchDetail