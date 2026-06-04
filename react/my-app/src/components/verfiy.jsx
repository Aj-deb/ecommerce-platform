import { fetchOtp, VerifyOtp } from "../api/Auth.api";
import { useRef, useState } from "react";
import Fields from "./input";
import Button from "./button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useSendOtp from "../hooks/sendotp";
import useCreateUser from "../hooks/createUser";

const Verify = ({ formdata }) => {
    const [otp, setOtp] = useState(["", "", "", ""])
    const navigate = useNavigate()
    const inputRefs = useRef([])
    const [toggle, setToggle] = useState(true)
    const [count, setCount] = useState(30)
    const running = useRef(true);
    const sendOtpRequest = useSendOtp(0)
    const creatingUser = useCreateUser()

async function handleVerify(otp) {
    const res = await VerifyOtp(otp, formdata.email)
    console.log(res.data.success);
    if (res?.data.success == true) {
        creatingUser.mutate(formdata)
        navigate("/dashboard")
    }
}
async function handleResend() {
    running.current = false
    sendOtpRequest.mutate(formdata.email)
    setToggle(false)
    run()
}
function run() {
    if (running.current) {
        return
    }
    setTimeout(() => {
        setCount(prev => {
            if (prev <= 1) {
                setToggle(true)
                setCount(30)
                running.current = true
                return
            }

            return prev - 1

        })
        run()
        console.log("lopp running");
    }, 1000);
}
function maxOne(value, idx) {
    if (value >= "a" && value <= "z") {
        return
    }
    const cleaned = value.slice(0, 1)
    const newOtp = [...otp]
    newOtp[idx] = cleaned
    setOtp(newOtp)
    if (cleaned !== "" && idx < 3) {
        inputRefs.current[idx + 1].focus();
    }
    if (cleaned === "" && idx >= 1)
        inputRefs.current[idx - 1].focus();
}
return (
    <>
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div >
                <p className="text-[24px] font-sans font-sm  antialiased">Verify your email </p>
            </div>
            <div> 
                <p className="p-1 font-sm text-[12px]">Enter the OTP sent to your email {formdata.email} </p>
            </div>
            <div className="flex gap-2 lg:w-1/3 sm:w-1/2  ">
                {otp.map((digit, index) => (
                    <div key={index}>
                        <Fields  ref={(e1) => inputRefs.current[index] = e1} value={digit} type="text" onChange={(e) => maxOne(e.target.value, index)} />
                        {console.log(inputRefs.current)}
                    </div>
                ))}
            </div>
            <Button type="button" onClick={() => handleVerify(otp.join(""))}>Verify</Button>
            <div >
                <div className="flex justify-center w-full items-center">
                    {toggle && <button className="mt-1 m-auto" onClick={handleResend} >Resend</button>}
                    {!toggle && <p className="m-auto">Resend otp after 00:{count}</p>}
                </div>
            </div>
        </div>
    </>
)
}
export default Verify