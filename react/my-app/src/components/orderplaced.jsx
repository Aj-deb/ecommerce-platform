import { useNavigate } from "react-router-dom";
import Order from "../pages/OrderConfirmed";
const OrderPlaced =()=>{
    const navigate = useNavigate()
    setTimeout(() => {
        navigate("/OrderPage")
    }, 5000);
    return (
        <>
        <h1>Order has been placed</h1>
        </>
    )
}
export default OrderPlaced