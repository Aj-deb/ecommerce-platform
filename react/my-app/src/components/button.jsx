import React from "react"
export default function Button({type,children,className ,onClick}){
    return(
        <>
            <button onClick={onClick} className={`bg-[#9333EA] text-white px-5 py-2 rounded-md hover:bg-blue-700 transition mt-4  ${className}`} type={type}>{children}</button>
        </>
    )
}