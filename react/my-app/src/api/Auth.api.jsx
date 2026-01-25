import api from "./axios"

const loginUser = async(data) =>{
    try{
        const response = await api.post("/users/login",data)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const createUser = async(data) =>{
    try{
        const response = await api.post("/users/create",data)
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export default loginUser
// axios return promise (resolve,reject)
// then catch
// async await 
// 3 states -> pending fulfieed and rejected
//