// src/pages/AddEditAddress.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import PageTransition from "../components/PageTransition";

export function AddEditAddress() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5000/api/users/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Saved:", data);

      navigate("/account/addresses");
    } catch (err) {
      console.error("Error saving:", err);
    }
    setLoading(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#150015] to-[#0a0011] px-6 py-10">
        <div className="w-full max-w-md neon-card border border-purple-500/40 p-8 rounded-2xl shadow-2xl backdrop-blur-lg">
          <h1 className="text-3xl font-bold text-center mb-6 neon-text">
            Add Address
          </h1>

          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key.toUpperCase()}
              className="w-full mb-4 p-3 rounded-lg bg-white/10 text-white border border-purple-400 focus:ring-2 focus:ring-yellow-400"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg font-bold text-black shadow-xl hover:scale-105 transition-all"
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
