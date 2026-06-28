import Button from "./button"
import Fields from "./input"
import { ShoppingBag } from "lucide-react"
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useState } from "react";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
function Modal({ onClick }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const onLogin = useLogin()
    const navigate = useNavigate()

    return createPortal(
        <div className="fixed inset-0 flex z-50 bg-black/50 items-center justify-center ">
            <div className="  w-[90%]  max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                <X onClick={onClick} />
                <div className=" flex flex-col justify-center items-center ">
                    <ShoppingBag className="text-violet-600 mb-2" />
                    <p className="text-[clamp(1.5rem,4vw,1rem)] py-2 font-bold text-black">Login Required</p>
                    <p className="mt-2 text-center text-gray-500">Please login to continue and place your order securely</p>
                </div>
                <div className="mt-4 ">
                    <p className="font-bold text-sm">Email</p>
                    <Fields value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                    <p className="mt-4 font-bold text-gray-700 text-sm">Password</p>
                    <Fields value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                    <Button onClick={() => onLogin.mutate({ email, password }
                        , {
                            onSuccess: () => {
                                navigate("/OrderPage")
                            }
                        }
                    )
                    } className={"w-full"}>Login</Button>
                </div>
            </div>
        </div>, document.body
    )
}
export default Modal