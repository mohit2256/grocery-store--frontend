// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";
import { FiRefreshCcw, FiPackage, FiUsers, FiShoppingBag } from "react-icons/fi";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://grocery-store-backend-m0xj.onrender.com";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    uniqueCustomers: 0,
    salesTrend: {},
    productMix: [],
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken(true);

      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-purple-600 text-2xl">
        Loading Dashboard Analytics...
      </div>
    );

  const lineData = {
    labels: Object.keys(stats.salesTrend),
    datasets: [
      {
        label: "Sales (₹)",
        data: Object.values(stats.salesTrend),
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124,58,237,0.25)",
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: stats.productMix.map((p) => p._id),
    datasets: [
      {
        data: stats.productMix.map((p) => p.count),
        backgroundColor: ["#7c3aed", "#9333ea", "#a855f7", "#c084fc", "#e9d5ff"],
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">

      <h1 className="text-3xl font-bold text-purple-700 mb-1">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Purple Power Analytics — Live insights for Lala & Sons Grocery
      </p>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">

        {/* Revenue */}
        <div className="p-5 bg-purple-900 text-white rounded-xl shadow flex items-center gap-4">
          <FiShoppingBag size={35} />
          <div>
            <p className="text-sm opacity-80">Total Revenue</p>
            <h2 className="text-2xl sm:text-3xl font-bold">₹{stats.totalRevenue}</h2>
          </div>
        </div>

        {/* Orders */}
        <div className="p-5 bg-purple-900 text-white rounded-xl shadow flex items-center gap-4">
          <FiPackage size={35} />
          <div>
            <p className="text-sm opacity-80">Total Orders</p>
            <h2 className="text-2xl sm:text-3xl font-bold">{stats.totalOrders}</h2>
          </div>
        </div>

        {/* Customers */}
        <div className="p-5 bg-purple-900 text-white rounded-xl shadow flex items-center gap-4">
          <FiUsers size={35} />
          <div>
            <p className="text-sm opacity-80">Customers</p>
            <h2 className="text-2xl sm:text-3xl font-bold">{stats.uniqueCustomers}</h2>
          </div>
        </div>
      </div>

      {/* TOP BUTTONS */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
        <Link
          to="/admin/products"
          className="px-4 py-2 bg-purple-200 rounded-lg text-sm sm:text-base hover:bg-purple-300"
        >
          Products
        </Link>

        <Link
          to="/admin/orders"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm sm:text-base hover:bg-purple-700"
        >
          Orders
        </Link>

        <button
          onClick={loadStats}
          className="px-4 py-2 bg-purple-100 rounded-lg text-sm sm:text-base hover:bg-purple-200"
        >
          <FiRefreshCcw />
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SALES TREND CHART */}
        <div className="lg:col-span-2 p-4 sm:p-6 bg-white rounded-xl shadow">
          <h2 className="font-bold text-lg text-purple-700 mb-3">
            Sales Trend (7 days)
          </h2>
          <div className="w-full h-64 sm:h-80">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* PRODUCT MIX */}
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow">
          <h2 className="font-bold text-lg text-purple-700 mb-3">Product Mix</h2>
          <div className="w-full h-64 sm:h-80">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="mt-8 p-4 sm:p-6 bg-white rounded-xl shadow overflow-x-auto">

        <h2 className="text-lg sm:text-xl font-bold text-purple-700 mb-4">
          Recent Orders
        </h2>

        {stats.recentOrders.length === 0 ? (
          <p>No recent orders</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="font-semibold text-gray-600 border-b text-left">
                <th className="py-2 px-3">Order</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Total</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="py-2 px-3">{o._id.slice(-5)}</td>
                  <td className="py-2 px-3">{o.userId?.name || "Unknown"}</td>
                  <td className="py-2 px-3">₹{o.totalPrice}</td>
                  <td className="py-2 px-3">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
