import React, { forwardRef } from "react"
const Fields =forwardRef(({type,value,onChange,name,placeholder},ref)=>{
        return(
            <>
            <div className="w-full border border-gray-300 rounded-md px-3 py-2
            focus-within:border-indigo-500 mt-1"
            onClick="this.querySelector('input').focus()">
                <input  ref = {ref} value ={value} className="w-full border-0  focus:outline-none " type={type} onChange = {onChange} name = {name} placeholder={placeholder}  />
            </div>
            </>
        )
    })
export default Fields;