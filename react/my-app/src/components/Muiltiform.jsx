import { useState } from "react";
import useMultiform from "../hooks/useMulitplestate";
import Register from "../pages/register";
import AuthLayout from "../Context/Authlayout";
import Leftside from "./leftcomponet";
import Verify from "../components/verfiy"

const Multiform = () => {
    const { step, next, prev } = useMultiform()
    const steps = {
        1: Register,
        2: Verify
    }
    const StepComponent = steps[step]
    const [formdata,setFormdata] = useState({
        "name":"",
        "email":"",
        "password":"",
        "confirmpassword":""
    })
        return (
        <AuthLayout  left= {<Leftside
                        title={<>Join SWIFTCART</>}
                        subtitle="Register to make shopping easy"
                    />}>
            <StepComponent formdata={formdata} setFormdata ={setFormdata} next={next} prev={prev} />
        </AuthLayout>
    )
}
export default Multiform