// src/admin/AdminAddProduct.jsx
import React, { useState } from "react";
import { useAuth } from "../context/Authcontext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export default function AdminAddProduct({ onCreated }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    unit: "",
    image: "",
    description: "",
    brand: "",
    stock: 0,
    weight: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!user) throw new Error("Authentication required");

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          price: Number(form.price),
          unit: form.unit,
          image: form.image,
          category: form.category,
          description: form.description,
          brand: form.brand,
          stock: Number(form.stock),
          weight: form.weight,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add product");
      }

      const data = await res.json();
      setSuccess("✅ Product added successfully!");

      // RESET FORM
      setForm({
        title: "",
        price: "",
        category: "",
        unit: "",
        image: "",
        description: "",
        brand: "",
        stock: 0,
        weight: "",
      });

      if (typeof onCreated === "function") onCreated(data.product || data);
    } catch (err) {
      setError(err.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 border border-purple-200">
      
      <h2 className="text-2xl font-bold text-purple-700 mb-2">Add New Product</h2>
      <p className="text-gray-600 mb-6">Create a new product listing for the store</p>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-700">Product Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Aashirvaad Atta"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Price (₹)</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 120"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Rice, Oil, Snacks"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Unit</label>
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="e.g. 1kg, 500g, 5L"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-gray-700">Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Paste product image URL"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Brand</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="e.g. Fortune, Aashirvaad"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Stock</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="e.g. 25"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Weight</label>
          <input
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="e.g. 500g"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short product description"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          disabled={loading}
          onClick={submit}
          className="w-full sm:w-auto px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-all"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>
    </div>
  );
}
