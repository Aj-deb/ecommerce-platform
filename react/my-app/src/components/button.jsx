import React from "react"
export default function Button({name}){
    
    const Button = React.memo(()=>{
        return <button>Save</button>
    })
}