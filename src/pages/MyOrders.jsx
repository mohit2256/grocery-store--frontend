// src/pages/MyOrders.jsx — FULL NEON VERSION WITH STATUS CHIPS
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function MyOrders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || "https://grocery-store-backend-m0xj.onrender.com";

  const STATUS_COLORS = {
    Pending: "bg-yellow-400 text-black shadow-yellow-300",
    Packed: "bg-blue-500 text-white shadow-blue-400",
    "Out for delivery": "bg-purple-500 text-white shadow-purple-400",
    Delivered: "bg-green-500 text-white shadow-green-400",
    Cancelled: "bg-red-500 text-white shadow-red-400",
  };

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        const token = await user.getIdToken(true);

        const res = await fetch(`${API_BASE}/api/orders/myorders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Fetch error:", await res.text());
          setOrders([]);
          return;
        }

        const data = await res.json();

        const finalOrders = Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
          ? data.orders
          : [];

        setOrders(finalOrders);
      } catch (err) {
        console.log("❌ MyOrders error:", err);
      } finally {
        setFetching(false);
      }
    };

    loadOrders();
  }, [user, loading, navigate]);

  // LOADING
  if (loading || fetching) {
    return (
      <PageTransition>
        <div className="min-h-screen flex justify-center items-center bg-[#12001f]">
          <p className="text-xl text-purple-300 font-semibold animate-pulse">
            Loading your orders...
          </p>
        </div>
      </PageTransition>
    );
  }

  // NO ORDERS
  if (orders.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#12001f] text-center">
          <h1 className="text-3xl font-bold text-purple-300 mb-3">
            My Orders
          </h1>
          <p className="text-purple-400 mb-5">You have no orders yet.</p>
          <button
            className="px-5 py-2 rounded-lg bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:scale-105 transition"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </div>
      </PageTransition>
    );
  }

  // MAIN UI
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0f001a] p-5 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-300 text-center mb-10 tracking-wide drop-shadow-lg">
          My Orders 📦
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#1a0030] border border-purple-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-600/30 transition-all"
            >
              {/* HEADER WITH ORDER ID + STATUS */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-xl font-bold text-purple-200">
                  Order #{String(order._id).slice(-6)}
                </h2>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-bold shadow-md ${
                    STATUS_COLORS[order.status] || "bg-gray-500 text-white"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* ORDER ITEMS */}
              <div className="mt-5 space-y-3">
                {(order.products || []).map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#250043] p-3 rounded-xl shadow-inner"
                  >
                    <span className="text-purple-200 text-sm sm:text-base">
                      {p.title || p.name}
                    </span>
                    <span className="text-yellow-300 font-semibold">
                      Qty: {p.quantity ?? p.qty ?? 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* PRICE + DATE */}
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center text-purple-300">
                <p className="text-lg font-semibold">
                  Total:{" "}
                  <span className="text-yellow-400">₹{order.totalPrice}</span>
                </p>

                <p className="text-sm opacity-70 mt-2 sm:mt-0">
                  Placed on:{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
