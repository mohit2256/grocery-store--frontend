// src/components/ProductCard.jsx
import React, { useEffect, useState } from "react";
import ProductModal from "./ProductModal";

const HEALTHY_CATEGORIES = ["Rice", "Dal", "Flour"];

export default function ProductCard({ item, cart, setCart }) {
  const productKey = item._id || item.id;

  const [fav, setFav] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFav(favs.includes(productKey));

    const all = JSON.parse(localStorage.getItem("productReviews") || "{}");
    const list = all[productKey] || [];
    const avg = list.length
      ? list.reduce((a, b) => a + b.rating, 0) / list.length
      : 0;

    setAvgRating(Math.round(avg * 10) / 10);
    setReviewsCount(list.length);
  }, [productKey]);

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;

    if (favs.includes(productKey)) {
      updated = favs.filter((id) => id !== productKey);
      setFav(false);
    } else {
      updated = [...favs, productKey];
      setFav(true);
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // CART CHECK
  const isInCart = cart.some((cartItem) => cartItem.id === productKey);

  const addToCart = (e) => {
    e.stopPropagation();
    const exists = cart.find((i) => i.id === productKey);

    if (exists) {
      setCart(
        cart.map((i) =>
          i.id === productKey ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          id: productKey,
          qty: 1,
        },
      ]);
    }
  };

  const incrementItem = (e) => {
    e.stopPropagation();
    setCart(
      cart.map((cartItem) =>
        cartItem.id === productKey
          ? { ...cartItem, qty: cartItem.qty + 1 }
          : cartItem
      )
    );
  };

  const decrementItem = (e) => {
    e.stopPropagation();
    const updatedCart = cart
      .map((cartItem) =>
        cartItem.id === productKey
          ? { ...cartItem, qty: cartItem.qty - 1 }
          : cartItem
      )
      .filter((cartItem) => cartItem.qty > 0);

    setCart(updatedCart);
  };

  const currentItem = cart.find((cartItem) => cartItem.id === productKey);

  return (
    <>
      {/* 🔥 FULL PRO CARD */}
      <div
        onClick={() => setOpenModal(true)}
        className="
          bg-white 
          rounded-xl 
          p-2 
          cursor-pointer 
          transition-all 
          duration-300

          /* BLUE OUTLINE + GLOW */
          border border-[#1E3A8A]/70
          shadow-[0_3px_8px_rgba(30,58,138,0.15)]
          hover:border-[#2563eb]
          hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)]
          hover:-translate-y-1
          active:scale-[0.97]

          /* GLASS EFFECT */
          backdrop-blur-sm

          /* SMALLER WIDTH — MORE PRODUCTS ON SCREEN */
          w-[130px] sm:w-[140px] md:w-[145px]

          mx-[3px] mb-3
        "
        role="button"
      >
        {/* HEALTHY + FAV */}
        <div className="flex items-start justify-between">
          {HEALTHY_CATEGORIES.includes(item.category) && (
            <span className="text-[9px] bg-green-200 text-green-800 px-2 py-[2px] rounded-full font-medium">
              Healthy
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFav();
            }}
            aria-label="Favorite"
            className={`text-xs p-[3px] rounded-full border 
              ${
                fav
                  ? "bg-pink-100 border-pink-400 text-pink-600"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
          >
            {fav ? "♥" : "♡"}
          </button>
        </div>

        {/* IMAGE */}
        <div className="mt-1 h-20 flex items-center justify-center">
          <img
            src={item.image}
            alt={item.title}
            className="object-contain h-16 w-full rounded-md"
          />
        </div>

        {/* TITLE */}
        <h4 className="text-[13px] font-semibold mt-1 line-clamp-2 leading-tight">
          {item.title}
        </h4>

        {/* PRICE + UNIT + ADD BUTTON */}
        <div className="flex items-center justify-between mt-1">
          <div>
            <div className="text-[13px] font-bold text-gray-800">
              ₹{item.price}
            </div>
            {item.unit && (
              <div className="text-[10px] text-gray-400">{item.unit}</div>
            )}
          </div>

          <div>
            {/* CART BUTTONS */}
            {isInCart ? (
              <div className="flex items-center space-x-1">
                <button
                  onClick={decrementItem}
                  className="bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full hover:bg-red-600"
                >
                  -
                </button>
                <span className="text-[12px] font-semibold">
                  {currentItem?.qty || 1}
                </span>
                <button
                  onClick={incrementItem}
                  className="bg-green-600 text-white text-[10px] px-2 py-[2px] rounded-full hover:bg-green-700"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={addToCart}
                className="
                  bg-blue-700 
                  text-white 
                  text-[10px] 
                  px-3 
                  py-[3px] 
                  rounded-full 
                  hover:bg-blue-800
                  shadow-md
                "
              >
                ADD
              </button>
            )}
          </div>
        </div>

        {/* RATING + REVIEWS */}
        <div className="flex items-center justify-between mt-1">
          <div className="text-[10px] text-yellow-500 flex items-center">
            {avgRating > 0 ? (
              Array.from({ length: Math.round(avgRating) }).map((_, i) => (
                <span key={i}>★</span>
              ))
            ) : (
              <span className="text-gray-300">☆</span>
            )}
            <span className="ml-1 text-gray-600 text-[10px]">
              ({avgRating})
            </span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal(true);
            }}
            className="text-[10px] text-gray-500 underline"
          >
            {reviewsCount} reviews
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <ProductModal
          product={{ ...item, id: productKey }}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
}
