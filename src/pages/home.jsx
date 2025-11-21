import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategorySection from "../components/CategorySection";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const placeholders = ["pulses", "rice", "flour", "oil", "snacks", "spices"];

const quotes = [
  "Fresh, fast, and always available!",
  "Quality groceries delivered with care 🥬",
  "From our store to your door — instantly 🚀",
  "Shop smart, eat fresh, live better 💜",
];

export default function Home({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // FETCH REAL PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        setProducts(data.products || data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // rotating placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // rotating quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category || "Others"))];

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      (p.title || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const cat = product.category || "Others";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-600 text-xl font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#f8f5ff] min-h-screen pb-10 sm:pb-20">
      {/* HEADER */}
      <div className="text-center py-6 sm:py-10 bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-b-2xl shadow-md">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex justify-center items-center gap-2">
          Our Products <span className="text-3xl md:text-4xl">🛒</span>
        </h2>

        {/* QUOTE ANIMATION */}
        <div className="h-6 sm:h-8 mt-2 relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              className="absolute w-full text-sm sm:text-lg md:text-xl font-medium"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
            >
              {quotes[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium shadow transition-all ${
              selectedCategory === cat
                ? "bg-purple-600 text-white scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full sm:w-2/3 md:w-1/2 mx-auto mt-6 group">
        <input
          type="text"
          placeholder={`🔍 Search for ${placeholders[placeholderIndex]}...`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-5 py-3 rounded-full shadow-md border border-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-300 bg-white/80 text-sm sm:text-base"
        />
        <span className="absolute right-4 top-3 sm:top-3.5 text-purple-500 animate-pulse text-lg sm:text-xl">
          🔎
        </span>
      </div>

      {/* PRODUCTS */}
      <div className="mt-10">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category) => (
            <CategorySection
              key={category}
              title={category}
              products={groupedProducts[category]}
              cart={cart}
              setCart={setCart}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg mt-10">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
