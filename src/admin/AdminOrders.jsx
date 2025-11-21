// src/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export default function AdminOrders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!loading && user) loadOrders();
  }, [loading, user]);

  const loadOrders = async () => {
    try {
      setFetching(true);
      setError("");

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load orders");
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updated.order || updated : o))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-400 text-xl">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-300 drop-shadow">
          Manage Orders
        </h1>

        <button
          onClick={loadOrders}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-lg transition"
        >
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-200 text-red-800 rounded mb-4">
          {error}
        </div>
      )}

      {/* WRAPPER */}
      <div className="overflow-x-auto bg-white/10 backdrop-blur-lg rounded-xl border border-purple-500/30 shadow-xl">

        <table className="min-w-full">
          {/* TABLE HEADER */}
          <thead>
            <tr className="bg-purple-700 text-white text-sm uppercase tracking-wide">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-300">
                  No orders found
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-purple-500/20 hover:bg-purple-600/10 transition"
              >
                <td className="p-3">{order._id.slice(-6)}</td>
                <td className="p-3">
                  {order.userSnapshot?.name ||
                    order.user?.name ||
                    order.user?.email ||
                    "Unknown"}
                </td>
                <td className="p-3 font-semibold">₹{order.totalPrice}</td>

                {/* STATUS DROPDOWN */}
                <td className="p-3">
                  <select
                    className="px-2 py-1 rounded bg-purple-900 text-white border border-purple-400 shadow"
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    {[
                      "Pending",
                      "Packed",
                      "Out for delivery",
                      "Delivered",
                      "Cancelled",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                {/* DATE */}
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleString()}
                </td>

                {/* VIEW BTN */}
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    className="px-3 py-1 rounded-lg bg-purple-500 text-white shadow hover:bg-purple-700 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* MOBILE FALLBACK */}
      <style>{`
        @media (max-width: 640px) {
          table {
            font-size: 12px;
          }
          th, td {
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
