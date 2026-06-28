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
export const verifyUser = async () => {
  console.log("verify user called");
  const token = localStorage.getItem("token");

  try{
    const response = api.get("/users/me",{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    return response
  }
  catch(err){
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

export const VerifyEmail = async(formdata) =>{
    try{
        const response = await api.post("/users/email_verify",{
            "email_Verify":formdata.email,
            "name":formdata.name,
            "password": formdata.password,
            "confirmpassword":formdata.confirmpassword
        })
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const fetchOtp = async(email) =>{
    try{
        console.log(email)
        const response = await api.post("/otp",{email:email})
        return response
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const VerifyOtp = async(otp,email) =>{
    try{
        const response = await api.post("/otp/verify",{
            otp:otp,
            email:email
        })
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
