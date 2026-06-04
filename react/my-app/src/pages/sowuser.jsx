// import React, { useState } from "react";
function Show(props){
    return(
        <>
            <p>your form has been submiited {props.name} <br/>
               your email is {props.email}
               <br/>
               your password is {props.password}
               <br/>
               your role is {props.role}
            </p>
        </>
    )
}
export default Show