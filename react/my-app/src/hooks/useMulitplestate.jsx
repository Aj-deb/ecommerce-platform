import { useState } from "react";


export default function useMultiform(){
    const [step,setState] = useState(1)
    function next(){
        setState((prev)=>prev+1)
    }

    function prev(){
        setState((prev)=>prev-1)
    }

    return {step,next,prev}
}