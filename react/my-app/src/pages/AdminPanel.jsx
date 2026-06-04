import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetOrder,
  adminListOrders,
  adminSearchProducts,
  adminUpdateOrderItems,
  adminUpdateOrderStatus,
} from "../api/admin.api";

const STATUSES = ["PENDING", "PROCESSING", "CANCELLED"];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("PROCESSING");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);

  const logoutAdmin = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login", { replace: true });
  };

  const refreshOrders = async () => {
    setError("");
    setLoadingOrders(true);
    try {
      const data = await adminListOrders({ limit: 25 });
      setOrders(data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const loadOrder = async (orderId) => {
    setError("");
    setSelectedOrderId(orderId);
    setLoadingOrder(true);
    try {
      const data = await adminGetOrder(orderId);
      setSelectedOrder(data);
      setStatus(String(data.status || "").toUpperCase());
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load order");
    } finally {
      setLoadingOrder(false);
    }
  };

  const editableItems = useMemo(() => selectedOrder?.items || [], [selectedOrder]);

  const updateItem = (index, patch) => {
    setSelectedOrder((prev) => {
      if (!prev) return prev;
      const items = [...(prev.items || [])];
      items[index] = { ...items[index], ...patch };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setSelectedOrder((prev) => {
      if (!prev) return prev;
      const items = [...(prev.items || [])];
      items.push({
        id: undefined,
        product_id: "",
        product_name: "",
        product_image: "",
        quantity: 1,
        price: 0,
      });
      return { ...prev, items };
    });
  };

  const removeItem = (index) => {
    setSelectedOrder((prev) => {
      if (!prev) return prev;
      const items = [...(prev.items || [])];
      items.splice(index, 1);
      return { ...prev, items };
    });
  };

  const saveStatus = async () => {
    if (!selectedOrderId) return;
    setSaving(true);
    setError("");
    try {
      await adminUpdateOrderStatus({ orderId: selectedOrderId, status });
      await loadOrder(selectedOrderId);
      await refreshOrders();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const saveItems = async () => {
    if (!selectedOrderId) return;
    setSaving(true);
    setError("");
    try {
      const items = (selectedOrder?.items || []).map((i) => ({
        id: i.id,
        product_id: Number(i.product_id),
        quantity: Number(i.quantity || 1),
      }));
      await adminUpdateOrderItems({ orderId: selectedOrderId, items });
      await loadOrder(selectedOrderId);
      await refreshOrders();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to update items");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(async () => {
      const q = productSearch.trim();
      if (!q) return setProductResults([]);
      try {
        const data = await adminSearchProducts({ q, limit: 10 });
        setProductResults(data || []);
      } catch {
        setProductResults([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [productSearch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-950">Admin Panel</h1>
            <p className="text-sm text-slate-500">Manage orders and user carts.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshOrders}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
            <button
              onClick={logoutAdmin}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Orders</h2>
          <div className="mt-3 space-y-2">
            {loadingOrders ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => loadOrder(o.id)}
                className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                  selectedOrderId === o.id
                    ? "border-violet-300 bg-violet-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">#{o.id}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {String(o.status || "").toUpperCase()}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">User: {o.user_email || o.user_id}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Order Details</h2>

            {error ? (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            ) : null}

            {!selectedOrder ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                Select an order to manage.
              </div>
            ) : null}

            {loadingOrder ? <p className="mt-4 text-sm text-slate-500">Loading order...</p> : null}

            {selectedOrder ? (
              <div className="mt-4 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-lg font-bold text-slate-950">Order #{selectedOrder.id}</div>
                    <div className="text-sm text-slate-500">User: {selectedOrder.user_email || selectedOrder.user_id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={saveStatus}
                      disabled={saving}
                      className="rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:bg-violet-300"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Items</h3>
                    <button
                      onClick={addItem}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Add Item
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {editableItems.map((item, idx) => (
                      <div key={item.id ?? `new-${idx}`} className="rounded-xl border border-slate-200 p-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:items-end">
                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-slate-600">Product ID</label>
                            <input
                              className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:bg-white"
                              value={item.product_id}
                              onChange={(e) => updateItem(idx, { product_id: e.target.value })}
                            />
                            <div className="mt-1 text-xs text-slate-500">{item.product_name}</div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Qty</label>
                            <input
                              type="number"
                              min="1"
                              className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:bg-white"
                              value={item.quantity}
                              onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Price</label>
                            <div className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                              {item.price}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => removeItem(idx)}
                              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-sm text-slate-600">
                      Subtotal: <span className="font-semibold text-slate-900">{selectedOrder.subtotal}</span>
                    </div>
                    <button
                      onClick={saveItems}
                      disabled={saving}
                      className="rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:bg-violet-300"
                    >
                      Save Items
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Product Search</div>
                  <input
                    className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
                    placeholder="Search products by name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  {productResults.length ? (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {productResults.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            if (!editableItems.length) return;
                            updateItem(0, {
                              product_id: p.id,
                              product_name: p.name,
                              price: p.price,
                            });
                          }}
                          className="rounded-lg border border-slate-200 bg-white p-3 text-left text-sm hover:bg-slate-50"
                        >
                          <div className="font-semibold text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-500">#{p.id} • ${p.price}</div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-2 text-xs text-slate-500">
                    Tip: clicking a product fills the first item row’s product fields.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

