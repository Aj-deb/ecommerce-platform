import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminLogin = async ({ username, password }) => {
  const res = await adminApi.post("/admin/login", { username, password });
  return res.data;
};

export const adminMe = async () => {
  const res = await adminApi.get("/admin/me");
  return res.data;
};

export const adminListOrders = async (params) => {
  const res = await adminApi.get("/admin/orders", { params });
  return res.data;
};

export const adminGetOrder = async (orderId) => {
  const id = Number(orderId);
  if (Number.isNaN(id)) throw new Error(`Invalid orderId: ${orderId}`);
  const res = await adminApi.get(`/admin/orders/${id}`);
  return res.data;
};

export const adminUpdateOrderStatus = async ({ orderId, status }) => {
  const id = Number(orderId);
  if (Number.isNaN(id)) throw new Error(`Invalid orderId: ${orderId}`);
  const res = await adminApi.put(`/admin/orders/${id}/status`, { status });
  return res.data;
};

export const adminUpdateOrderItems = async ({ orderId, items }) => {
  const id = Number(orderId);
  if (Number.isNaN(id)) throw new Error(`Invalid orderId: ${orderId}`);
  const res = await adminApi.put(`/admin/orders/${id}/items`, { items });
  return res.data;
};

export const adminSearchProducts = async ({ q, limit = 20 }) => {
  const res = await adminApi.get("/admin/products", { params: { q, limit } });
  return res.data;
};

export const adminGetUserCart = async (userId) => {
  const id = Number(userId);
  if (Number.isNaN(id)) throw new Error(`Invalid userId: ${userId}`);
  const res = await adminApi.get(`/admin/users/${id}/cart`);
  return res.data;
};

export const adminUpdateUserCart = async ({ userId, items }) => {
  const id = Number(userId);
  if (Number.isNaN(id)) throw new Error(`Invalid userId: ${userId}`);
  const res = await adminApi.put(`/admin/users/${id}/cart`, { items });
  return res.data;
};

export default adminApi;

