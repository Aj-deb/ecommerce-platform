import { useMutation } from "@tanstack/react-query"
import { fetchOtp } from "../api/Auth.api"


export default function useSendOtp({next}){
    return useMutation({ 
            mutationFn:fetchOtp,
            onSuccess:()=>{
                next()
            }
        })
}
