// src/pages/MyAccount.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import PageTransition from "../components/PageTransition";

export function MyAccount() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center p-10 text-purple-400 text-xl animate-pulse">
        Loading...
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-[#1c0032] via-[#2d0054] to-[#120021] text-white flex justify-center">
        <div className="max-w-3xl w-full">
          {/* PAGE HEADER */}
          <h1 className="text-4xl font-bold mb-2 text-purple-300 drop-shadow-[0_0_10px_#a855f7]">
            My Account
          </h1>
          <p className="text-purple-200 mb-8 opacity-80 text-lg">
            Manage your profile, orders & settings
          </p>

          {/* PROFILE CARD */}
          <div className="
            bg-white/10
            backdrop-blur-xl
            border border-purple-500/40
            shadow-[0_0_25px_#a855f788]
            rounded-2xl p-6 mb-10
          ">
            <h2 className="text-2xl font-semibold mb-4 text-purple-200 drop-shadow-[0_0_10px_#c084fc]">
              Profile Overview
            </h2>

            <div className="space-y-2 text-[1rem]">
              <p><span className="font-semibold text-purple-300">Name:</span> {user.displayName || "Not set"}</p>
              <p><span className="font-semibold text-purple-300">Email:</span> {user.email}</p>
              <p><span className="font-semibold text-purple-300">UID:</span> {user.uid}</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* BUTTON COMPONENT */}
            <NeonButton to="/account/edit">Edit Profile</NeonButton>
            <NeonButton to="/account/addresses">Manage Addresses</NeonButton>
            <NeonButton to="/myorders">My Orders</NeonButton>
            <NeonButton to="/account/settings">Account Settings</NeonButton>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

/* 🔥 NEON BUTTON COMPONENT — Reusable */
function NeonButton({ to, children }) {
  return (
    <Link
      to={to}
      className="
        bg-gradient-to-r from-[#7C3AED] to-[#9333EA]
        hover:from-[#A855F7] hover:to-[#C084FC]
        text-white text-center py-3 rounded-xl font-medium
        shadow-[0_0_20px_#a855f766]
        hover:shadow-[0_0_30px_#c084fcaa]
        transition-all duration-300
        active:scale-95
        border border-purple-400/40
      "
    >
      {children}
    </Link>
  );
}
