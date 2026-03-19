import React from "react"
export default function Fields({type,onChange,name,placeholder}){
    return(
        <>
        <div className="w-full border border-gray-300 rounded-md px-3 py-2
         focus-within:border-indigo-500 mt-1"
        onClick="this.querySelector('input').focus()">
            <input className="w-full border-0  focus:outline-none " type={type} onChange = {onChange} name = {name} placeholder={placeholder}  />
        </div>
        </>
    )
}