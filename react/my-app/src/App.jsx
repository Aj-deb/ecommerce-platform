import React, { useState } from "react";
import ReactDom from "react-dom/client"
import {Route,Routes,Link} from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import {BrowserRouter} from "react-router-dom"
import Register from "./pages/register"
import ProtectedRoute from "./components/Protectedapi"
import { Navigate } from "react-router-dom";

const App =()=>{
  return (
    //history object has been created
    <BrowserRouter>
      <Routes>
        <Route path="/Register" element={
            <ProtectedRoute>  
              <Register/>
            </ProtectedRoute>
        }/>
        <Route path="/" element = {<Login />}/>
        <Route path="/Dashboard" 
          element = {
          <ProtectedRoute>  
            <Dashboard/>
          </ProtectedRoute>
          }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

