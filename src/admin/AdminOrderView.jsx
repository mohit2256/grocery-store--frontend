// src/admin/AdminOrderView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://grocery-store-backend-m0xj.onrender.com";

export default function AdminOrderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && user) loadOrder();
  }, [loading, user, id]);

  const loadOrder = async () => {
    try {
      setFetching(true);
      setError("");

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_BASE}/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load order");

      const data = await res.json();
      setOrder(data.order || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setSaving(true);

      const token = await user.getIdToken(true);
      const res = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      await loadOrder();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex justify-center items-center text-purple-300 text-xl">
        Loading Order...
      </div>
    );
  }

  if (!order || error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-400 text-xl">
        {error || "Order Not Found"}
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-2xl neon-content-box text-white"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-300 drop-shadow-lg">
          Order Details
        </h1>

        <button
          onClick={() => navigate("/admin/orders")}
          className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 shadow-lg transition"
        >
          ← Back
        </button>
      </div>

      {/* SUMMARY CARD */}
      <div className="p-5 rounded-xl border border-purple-600 bg-[#1e013d] shadow-xl mb-8">
        <p><strong className="text-yellow-300">Order ID:</strong> {order._id}</p>
        <p><strong className="text-yellow-300">Customer:</strong> {order.userId?.name || order.userSnapshot?.name || "Unknown"}</p>
        <p><strong className="text-yellow-300">Email:</strong> {order.userId?.email || order.userSnapshot?.email || "N/A"}</p>
        <p><strong className="text-yellow-300">Total Price:</strong> ₹{order.totalPrice}</p>
        <p><strong className="text-yellow-300">Status:</strong> {order.status}</p>
        <p><strong className="text-yellow-300">Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {/* ITEMS TABLE */}
      <h2 className="text-2xl font-bold text-purple-300 mb-4">Items</h2>

      <div className="overflow-x-auto rounded-xl shadow-xl border border-purple-600 bg-[#0f0022]">
        <table className="min-w-full text-white text-sm">
          <thead className="bg-purple-700 text-white uppercase text-xs tracking-wide">
            <tr>
              <th className="p-3 border-purple-600 border">Image</th>
              <th className="p-3 border-purple-600 border">Title</th>
              <th className="p-3 border-purple-600 border">Qty</th>
              <th className="p-3 border-purple-600 border">Price</th>
            </tr>
          </thead>

          <tbody>
            {(order.products || order.items || []).map((item, idx) => (
              <tr key={idx} className="hover:bg-purple-800/40 transition">
                <td className="p-3 border border-purple-700">
                  <img
                    src={item.image || item.imageUrl}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg shadow"
                  />
                </td>
                <td className="p-3 border border-purple-700">{item.title || item.name}</td>
                <td className="p-3 border border-purple-700">{item.quantity || item.qty}</td>
                <td className="p-3 border border-purple-700">₹{item.priceAtOrder || item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* STATUS UPDATE */}
      <div className="mt-8 p-6 rounded-xl bg-[#1a0033] border border-purple-600">
        <h3 className="font-bold text-purple-200 mb-3">Update Status</h3>

        <div className="flex flex-wrap gap-3">
          {["Pending", "Packed", "Out for delivery", "Delivered", "Cancelled"].map((s) => (
            <button
              key={s}
              disabled={saving}
              onClick={() => updateStatus(s)}
              className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-900 text-white shadow-xl hover:scale-105 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
}
