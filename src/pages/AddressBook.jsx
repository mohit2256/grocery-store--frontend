// src/pages/AddressBook.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import PageTransition from "../components/PageTransition";

export default function AddressBook() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAddresses = async () => {
    try {
      const token = await user.getIdToken();

      const res = await fetch("https://grocery-store-backend-m0xj.onrender.com/api/users/address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("Fetched addresses:", data);

      if (Array.isArray(data)) {
        setAddresses(data);
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-[#150015] to-[#0a0011] text-white">

        <h1 className="text-3xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
          My Addresses
        </h1>

        <Link
          to="/account/addresses/add"
          className="block w-full max-w-md mx-auto text-center py-3 mb-8 
          bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg 
          font-bold text-black shadow-xl hover:scale-105 transition-all"
        >
          + Add New Address
        </Link>

        {/* Loading */}
        {loading && (
          <p className="text-purple-300 text-lg">Loading your addresses...</p>
        )}

        {/* No addresses */}
        {!loading && addresses.length === 0 && (
          <p className="text-purple-300 text-lg">No addresses saved yet.</p>
        )}

        {/* Address List */}
        <div className="grid gap-6 max-w-3xl">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="p-6 rounded-xl bg-white/10 border border-purple-400 
              shadow-xl backdrop-blur-md hover:scale-[1.02] transition"
            >
              <p className="text-xl font-semibold text-yellow-300 mb-2">
                {addr.name}
              </p>

              <p className="text-purple-200">{addr.address}</p>
              <p className="text-purple-200">{addr.city} - {addr.pincode}</p>
              <p className="text-purple-200 mt-1">📞 {addr.phone}</p>
            </div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
