// src/components/CategorySection.jsx
import React, { useMemo } from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CategorySection({ title, products = [], cart, setCart, showSeeAll = true }) {
  // group into columns of 2 (two-rows per column)
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < products.length; i += 2) {
      cols.push(products.slice(i, i + 2));
    }
    return cols;
  }, [products]);

  // refs for scrolling
  const scrollerId = `scroller-${title.replace(/\s+/g, "-").toLowerCase()}`;

  const scroll = (dir) => {
    const el = document.getElementById(scrollerId);
    if (!el) return;
    const step = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section className="my-6 px-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>

        <div className="flex items-center gap-3">
          {showSeeAll && (
            <Link to={`/category/${encodeURIComponent(title)}`} className="text-sm text-purple-600 hover:underline">
              See All →
            </Link>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 bg-white border rounded shadow-sm hover:bg-gray-100"
              aria-label="Scroll left"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 bg-white border rounded shadow-sm hover:bg-gray-100"
              aria-label="Scroll right"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* horizontal scroller with columns of 2 */}
      <div
        id={scrollerId}
        className="flex gap-3 overflow-x-auto py-2 px-1 snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {columns.map((col, idx) => (
          <div
            key={`${title}-col-${idx}`}
            className="flex-shrink-0 w-[150px] sm:w-[170px] md:w-[190px] grid grid-rows-2 gap-2 snap-start"
          >
            {col.map((p) => (
              <div key={p._id || p.id || p.title} className="row-span-1">
                <ProductCard item={p} cart={cart} setCart={setCart} />
              </div>
            ))}

            {/* if single in column, keep an empty spacer to keep consistent height */}
            {col.length === 1 && <div className="row-span-1" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  );
}
