import axios from "axios";
// const token = localStorage.getItem("token")

const api = axios.create({
  baseURL: "https://ecommerce-platform-9ihz.onrender.com",
  headers: { 
    "Content-Type": "application/json"
  }

});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) =>{
    return Promise.reject(error)
  }
);

export default api;
