const getGuestCartId=()=>{
    let uuid = localStorage.getItem("guest_cart_id")
    const token = localStorage.getItem("token")
    if (!uuid && !token){
        uuid = crypto.randomUUID();
        localStorage.setItem("guest_cart_id",uuid) 
    }
    return uuid
}

export default getGuestCartId