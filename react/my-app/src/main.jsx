import "./index.css" ; 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Dashboard from "./pages/dashboard";
import { StrictMode } from "react";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./pages/login";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
// const queryClient = QueryClient();
root.render(
    <StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </StrictMode>
);
