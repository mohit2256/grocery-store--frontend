// 🚀 src/admin/AdminProducts.jsx — NEON HYBRID VERSION
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export default function AdminProducts() {
  const { user, loading } = useAuth();

  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    unit: "",
    image: "",
    description: "",
    brand: "",
    stock: "",
    weight: "",
  });

  useEffect(() => {
    if (!loading && user) loadProducts();
  }, [loading, user]);

  const loadProducts = async () => {
    try {
      setFetching(true);
      setError("");

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_BASE}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      category: "",
      unit: "",
      image: "",
      description: "",
      brand: "",
      stock: "",
      weight: "",
    });
    setEditingProduct(null);
  };

  const saveProduct = async () => {
    try {
      setSaving(true);
      setError("");

      const token = await user.getIdToken(true);

      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `${API_BASE}/api/products/${editingProduct}`
        : `${API_BASE}/api/products`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");

      await loadProducts();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (p) => {
    setEditingProduct(p._id);
    setForm({
      title: p.title,
      price: p.price,
      category: p.category,
      unit: p.unit || "",
      image: p.image || "",
      description: p.description || "",
      brand: p.brand || "",
      stock: p.stock || "",
      weight: p.weight || "",
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      const token = await user.getIdToken(true);

      await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex justify-center items-center text-purple-300 text-xl">
        Loading products...
      </div>
    );
  }

  return (
    <div className="neon-content-box p-6 rounded-2xl text-white">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-purple-300 mb-8 drop-shadow-lg tracking-wide">
        Manage Products
      </h1>

      {/* ERRORS */}
      {error && <div className="text-red-400 font-semibold mb-3">{error}</div>}

      {/* PRODUCT FORM */}
      <div className="p-6 rounded-xl bg-[#17002f] bg-opacity-60 border border-purple-700 shadow-lg mb-10">

        <h2 className="text-2xl font-bold text-purple-200 mb-5">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {["title","price","category","unit","brand","stock","weight"].map((field) => (
            <input
              key={field}
              className="p-3 rounded-lg bg-white/10 border border-purple-500 focus:ring-2 focus:ring-yellow-400 text-white"
              name={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={handleChange}
            />
          ))}

          <textarea
            className="col-span-1 sm:col-span-2 lg:col-span-3 p-3 rounded-lg bg-white/10 border border-purple-500 text-white focus:ring-2 focus:ring-yellow-400"
            name="description"
            placeholder="DESCRIPTION"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />

          <input
            className="col-span-1 sm:col-span-2 lg:col-span-3 p-3 rounded-lg bg-white/10 border border-purple-500 text-white"
            name="image"
            placeholder="IMAGE URL"
            value={form.image}
            onChange={handleChange}
          />
        </div>

        {/* FORM BUTTONS */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={saveProduct}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-purple-700 hover:bg-purple-900 shadow-lg hover:scale-105 transition text-white"
          >
            {saving ? "Saving..." : editingProduct ? "Update" : "Add"}
          </button>

          {editingProduct && (
            <button
              onClick={resetForm}
              className="px-6 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 shadow"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="rounded-xl border border-purple-600 shadow-xl overflow-x-auto bg-[#0c001b]">
        <table className="min-w-full text-left text-white">
          <thead className="bg-purple-800 text-yellow-200 uppercase text-sm">
            <tr>
              <th className="p-3 border border-purple-700">Image</th>
              <th className="p-3 border border-purple-700">Title</th>
              <th className="p-3 border border-purple-700">Price</th>
              <th className="p-3 border border-purple-700">Category</th>
              <th className="p-3 border border-purple-700">Stock</th>
              <th className="p-3 border border-purple-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-purple-900/40 transition">
                <td className="p-3 border border-purple-700">
                  <img
                    src={p.image}
                    className="w-16 h-16 object-cover rounded-lg shadow"
                    alt=""
                  />
                </td>

                <td className="p-3 border border-purple-700">{p.title}</td>
                <td className="p-3 border border-purple-700">₹{p.price}</td>
                <td className="p-3 border border-purple-700">{p.category}</td>
                <td className="p-3 border border-purple-700">{p.stock}</td>

                <td className="p-3 border border-purple-700 space-x-2">
                  <button
                    onClick={() => beginEdit(p)}
                    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td className="p-6 text-center" colSpan={6}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
