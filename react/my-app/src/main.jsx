import "./index.css" ; 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Dashboard from "./pages/dashboard";
import { StrictMode } from "react";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./pages/login";
import "./index.css";
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
// const queryClient = QueryClient();
root.render(
    <StrictMode>
    <QueryClientProvider client = {queryClient}>
          <AuthProvider>
            <App/>
        </AuthProvider>
    </QueryClientProvider>
      
    </StrictMode>
);
