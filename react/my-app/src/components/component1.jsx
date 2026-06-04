// import { useEffect } from "react"
// import React, { useState } from "react";

// const Compenent1 =React.memo()

// function Compenent1(){
//     const [users,setUsers] = useState([])
//     useEffect(()=>{
//         fetch("https://dummyjson.com/users")
//         .then(res =>res.json())
//         .then(data=> setUsers(data.users))
//     },[])
//     return(
//         <>
//             <ol>
//                 {
//                     users.map((u)=>{
//                         return <li key = {u.key}>{u.firstName}</li>
//                     })
//                 }
//             </ol>
//         </>
//     );
// }
// export default Compenent1;