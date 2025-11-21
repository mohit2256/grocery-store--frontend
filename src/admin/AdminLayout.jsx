// src/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0f001f] text-white relative">

      {/* =======================
          MOBILE OVERLAY 
      ======================== */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        ></div>
      )}

      {/* =======================
          SIDEBAR (DESKTOP + MOBILE SLIDE)
      ======================== */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full w-72 bg-[#150032]
          border-r border-purple-700/50 shadow-xl flex flex-col p-6
          neon-sidebar transform transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <h1 className="text-2xl font-extrabold text-purple-300 tracking-wide mb-10 drop-shadow-lg">
          ⚡ Lala & Sons Admin
        </h1>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-4">

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `neon-link ${isActive ? "neon-active" : ""}`
            }
          >
            🏠 Dashboard
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `neon-link ${isActive ? "neon-active" : ""}`
            }
          >
            📦 Orders
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `neon-link ${isActive ? "neon-active" : ""}`
            }
          >
            🛒 Products
          </NavLink>

          <NavLink
            to="/"
            className="neon-link text-red-400 hover:text-red-300 hover:pl-4 transition-all duration-300"
          >
            ← Back to Store
          </NavLink>

        </nav>

        <div className="mt-auto text-purple-400 opacity-70 text-xs">
          Powered by ⚡ Blaze AI
        </div>
      </aside>

      {/* =======================
          MAIN CONTENT
      ======================== */}
      <main className="flex-1 bg-gradient-to-br from-[#1a0135] to-[#0a0017] p-6 sm:p-10 overflow-y-auto w-full">

        {/* TOP-BAR (HAMBURGER + BUTTONS) */}
        <div className="mb-8 flex justify-between items-center">

          {/* LEFT — HAMBURGER MOBILE */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-purple-300 text-3xl hover:text-white transition"
          >
            ☰
          </button>

          {/* TITLE */}
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 tracking-wide drop-shadow-lg">
            Admin Panel — Lala & Sons
          </h2>

          {/* TOP BUTTONS (HIDDEN ON SMALL MOBILE) */}
          <div className="hidden sm:flex gap-4">
            <NavLink to="/admin" className="neon-top-button">
              Dashboard
            </NavLink>

            <NavLink to="/admin/orders" className="neon-top-button">
              Orders
            </NavLink>

            <NavLink to="/admin/products" className="neon-top-button">
              Products
            </NavLink>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="neon-content-box">
          <Outlet />
        </div>
      </main>

      {/* =======================
          NEON CSS
      ======================== */}
      <style>{`
        .neon-sidebar {
          box-shadow: 0 0 30px rgba(155, 50, 255, 0.25);
        }

        .neon-link {
          padding: 12px 16px;
          border-radius: 10px;
          color: #c9b6ff;
          font-weight: 500;
          transition: 0.25s ease;
          background: rgba(255,255,255,0.03);
        }
        .neon-link:hover {
          color: #fff;
          background: rgba(166, 70, 255, 0.15);
          padding-left: 22px;
          box-shadow: 0 0 12px rgba(166, 70, 255, 0.4);
        }
        .neon-active {
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          color: white !important;
          box-shadow: 0 0 18px rgba(124, 58, 237, 0.8);
        }

        .neon-top-button {
          background: rgba(255,255,255,0.05);
          padding: 10px 20px;
          border-radius: 10px;
          color: #e9d5ff;
          font-weight: 600;
          transition: 0.25s ease;
          border: 1px solid rgba(200, 100, 255, 0.3);
          text-shadow: 0 0 10px #c084fc;
        }
        .neon-top-button:hover {
          background: rgba(150,50,255,0.2);
          box-shadow: 0 0 20px rgba(150, 50, 255, 0.5);
          transform: translateY(-2px);
        }

        .neon-content-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(170,80,255,0.25);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}
      </style>
    </div>
  );
}
