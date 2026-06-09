import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Register from "./pages/register";
import Cart from "./pages/Cart";
import Order from "./pages/OrderConfirmed";
import Products from "./pages/Products";
import Orderpage from "./pages/OrderPage";
import SpecifiedOrder from "./pages/OrderDetail";
import Shipping from "./pages/Shipping";
import Multiform from "./components/Muiltiform";
import ProductDetail from "./pages/ProductDetail";
import OrderConfirmationPage from "./pages/OrderConfirmed";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

import ProtectedRoute from "./components/Protectedapi";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const App = () => {
  return (
   <BrowserRouter>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/auth" element={<Multiform />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Dashboard />} />
    <Route path="/Products" element={<Products />} />
    <Route path="/Cart" element={<Cart />} />
    <Route path="/Shipping" element={<Shipping />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route
      path="/Order"
      element={
        <ProtectedRoute>
          <Order />
        </ProtectedRoute>
      }
    />

    <Route
      path="/OrderPage"
      element={
        <ProtectedRoute>
          <Orderpage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/SpecifiedOrder/:id"
      element={
        <ProtectedRoute>
          <SpecifiedOrder />
        </ProtectedRoute>
      }
    />

    <Route
      path="/OrderConfirmationPage/:id"
      element={
        <ProtectedRoute>
          <OrderConfirmationPage />
        </ProtectedRoute>
      }
    />

    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin"
      element={
        <AdminProtectedRoute>
          <AdminPanel />
        </AdminProtectedRoute>
      }
    />

  </Routes>
</BrowserRouter>
  );
};

export default App;
