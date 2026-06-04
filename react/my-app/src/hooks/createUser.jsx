import { useMutation } from "@tanstack/react-query"
import { createUser } from "../api/Auth.api"

export default function useCreateUser(){
    return useMutation({ 
            mutationFn:createUser,
        })
}
