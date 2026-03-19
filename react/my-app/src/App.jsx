import React, { useState } from "react";
import ReactDom from "react-dom/client"
import { Route, Routes, Link } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import { BrowserRouter } from "react-router-dom"
import Register from "./pages/register"
import ProtectedRoute from "./components/Protectedapi"
import Cart from "./pages/Cart"
import Order from "./pages/OrderConfirmed"
import Products from "./pages/Products";
import Orderpage from "./pages/OrderPage";
import SpecifiedOrder from "./pages/OrderDetail";
import Shipping from "./pages/Shipping"

const App = () => {
  return (
    //history object has been created
    <BrowserRouter>
      <Routes>
        <Route path="/Register" element={
          <Register />
        } />
      <Route path="/Shipping" element={
          <Shipping />
        } />
        <Route path="/" element={<Login />} />

        <Route path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

        <Route path="/Products"
          element={<Products />}
        />

        <Route path="/Cart"
          element={<Cart />}
        />

        <Route path="/Order"
          element={<Order />}
        />

        <Route path="/OrderPage"
          element={<Orderpage />}
        />

        <Route path="/SpecifiedOrder/:item_id"
          element={<SpecifiedOrder />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

