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
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/auth" element={<Multiform />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Shipping"
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        />

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
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
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

        {/* Admin Routes */}
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
