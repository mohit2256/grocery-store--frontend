// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../components/ProgressSteps";
import { useAuth } from "../context/Authcontext";

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });

  const [deliveryType, setDeliveryType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [savedAddress, setSavedAddress] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [fetchingSaved, setFetchingSaved] = useState(true);

  // -------------------------------
  // CART CALCULATIONS — NO DISCOUNTS
  // -------------------------------
  const itemTotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty || 1),
    0
  );

  const FREE_DELIVERY_THRESHOLD = 200;
  const handlingCharge = 18; // always FREE
  const deliveryCharge = itemTotal < FREE_DELIVERY_THRESHOLD ? 25 : 0;
  const amountToFreeDelivery =
    itemTotal < FREE_DELIVERY_THRESHOLD
      ? FREE_DELIVERY_THRESHOLD - itemTotal
      : 0;

  const finalPay = itemTotal + deliveryCharge;

  // -------------------------------
  // REDIRECT IF CART EMPTY
  // -------------------------------
  useEffect(() => {
    if (!cart || cart.length === 0) navigate("/cart");
  }, [cart, navigate]);

  // LOAD SAVED ADDRESS
  useEffect(() => {
    const saved = localStorage.getItem("savedAddress");
    if (saved) setSavedAddress(JSON.parse(saved));
    setFetchingSaved(false);
  }, []);

  // LOGIN CHECK
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const handleUseSaved = () => {
    if (savedAddress) setFormData(savedAddress);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // -------------------------------
  // VALIDATION
  // -------------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Enter full name.";
    if (!formData.address.trim()) newErrors.address = "Enter address.";
    if (!formData.city.trim()) newErrors.city = "Enter city.";
    if (!formData.phone.trim()) newErrors.phone = "Enter phone.";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10-digit number.";

    if (!deliveryType) newErrors.deliveryType = "Select delivery.";
    if (!paymentMethod) newErrors.paymentMethod = "Select payment.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // BUILD BACKEND PAYLOAD
  // -------------------------------
  const buildProductsForBackend = () =>
    cart.map((item) => ({
      productId: item._id,
      title: item.title,
      image: item.image,
      unit: item.unit,
      priceAtOrder: Number(item.price),
      quantity: Number(item.qty),
    }));

  // -------------------------------
  // PAYMENT HANDLER
  // -------------------------------
  const handlePayment = async () => {
    if (!validateForm()) return;

    if (!user) {
      alert("Please log in to continue.");
      navigate("/login");
      return;
    }

    setIsPaying(true);

    try {
      localStorage.setItem("savedAddress", JSON.stringify(formData));

      const token = await user.getIdToken(true);
      const products = buildProductsForBackend();

      const backendPaymentMethod = paymentMethod === "Online" ? "UPI" : "COD";

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"}/api/orders/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            products,
            totalPrice: finalPay,
            deliveryOption: deliveryType,
            paymentMethod: backendPaymentMethod,
            deliveryAddress: {
              name: formData.name,
              line1: formData.address,
              city: formData.city,
              phone: formData.phone,
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Order error.");

      localStorage.removeItem("cart");
      setCart([]);

      navigate("/success", { state: { order: data.order } });
    } catch (err) {
      const offlineOrder = {
        id: Date.now(),
        items: cart,
        finalPay,
        date: new Date().toLocaleString(),
        address: formData,
        deliveryType,
        paymentMethod,
        offline: true,
      };

      const prev = JSON.parse(localStorage.getItem("orders")) || [];
      localStorage.setItem("orders", JSON.stringify([...prev, offlineOrder]));

      localStorage.removeItem("cart");
      setCart([]);

      navigate("/success", { state: { order: offlineOrder } });
    } finally {
      setIsPaying(false);
    }
  };

  if (loading || fetchingSaved) {
    return (
      <div className="min-h-screen flex justify-center items-center text-purple-600">
        Loading checkout…
      </div>
    );
  }

  // -------------------------------------------
  // UI — RETURN
  // -------------------------------------------
  return (
    <>
      <ProgressSteps currentStep={2} />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto">

        {/* 🔥 PSYCHOLOGICAL DELIVERY BAR */}
        {itemTotal < FREE_DELIVERY_THRESHOLD && (
          <div className="p-3 mb-4 rounded-xl text-center font-semibold text-sm text-purple-900 bg-yellow-200 animate-pulse shadow">
            Add ₹{amountToFreeDelivery} more to unlock{" "}
            <span className="text-green-700">FREE Delivery!</span>
          </div>
        )}

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(
                (itemTotal / FREE_DELIVERY_THRESHOLD) * 100,
                100
              )}%`,
            }}
          ></div>
        </div>

        <h2 className="text-3xl font-bold mb-4 text-purple-700">Checkout</h2>

        {/* ⭐ OPTION A + D BUTTON (TOP) */}
        <button
          onClick={() => navigate("/")}
          className="
            w-full mb-5 py-3 rounded-xl font-semibold
            border border-purple-300 text-purple-600
            bg-white shadow
            hover:bg-purple-50 hover:border-purple-500
            transition-all active:scale-95
            animate-pulse
          "
        >
          ← Add More Products
        </button>

        {/* ORDER SUMMARY */}
        <div className="border rounded-xl p-4 mb-4 bg-white shadow">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>

          {cart.map((item) => (
            <div key={item._id} className="flex justify-between mb-1 text-sm">
              <span>
                {item.title} x {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr className="my-3" />

          <div className="flex justify-between mb-1 text-sm">
            <span>Item Total</span>
            <span>₹{itemTotal}</span>
          </div>

          <div className="flex justify-between mb-1 text-sm">
            <span>Handling Fee</span>
            <span className="text-green-700 font-bold">FREE</span>
          </div>

          <div className="flex justify-between mb-1 text-sm">
            <span>Delivery Fee</span>
            <span
              className={
                deliveryCharge === 0
                  ? "text-green-700 font-bold"
                  : "text-red-600 font-semibold"
              }
            >
              {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
            </span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-lg font-bold">
            <span>To Pay</span>
            <span>₹{finalPay}</span>
          </div>
        </div>

        {/* DELIVERY DETAILS */}
        <div className="border rounded-xl bg-white p-4 shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>

          {savedAddress && (
            <button
              className="bg-green-600 text-white w-full py-2 mb-3 rounded-lg"
              onClick={handleUseSaved}
            >
              Use Saved Address
            </button>
          )}

          {["name", "address", "city", "phone"].map((field) => (
            <div key={field} className="mb-3">
              <input
                name={field}
                placeholder={field.toUpperCase()}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full border p-2 rounded ${
                  errors[field]
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors[field] && (
                <p className="text-red-600 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* DELIVERY OPTION */}
        <div className="border rounded-xl p-4 mb-4 bg-white shadow">
          <h3 className="font-semibold mb-2">Delivery Option</h3>

          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              value="Home"
              checked={deliveryType === "Home"}
              onChange={(e) => setDeliveryType(e.target.value)}
            />
            Home Delivery
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Pickup"
              checked={deliveryType === "Pickup"}
              onChange={(e) => setDeliveryType(e.target.value)}
            />
            Pickup from Store
          </label>

          {errors.deliveryType && (
            <p className="text-red-600 text-sm">{errors.deliveryType}</p>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div className="border rounded-xl p-4 mb-6 bg-white shadow">
          <h3 className="font-semibold mb-2">Payment Method</h3>

          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Online"
              checked={paymentMethod === "Online"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Pay Online (UPI)
          </label>

          {errors.paymentMethod && (
            <p className="text-red-600 text-sm">{errors.paymentMethod}</p>
          )}
        </div>

        {/* PLACE ORDER */}
        <button
          disabled={isPaying}
          onClick={handlePayment}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 active:scale-95 shadow-lg"
        >
          {isPaying ? "Processing…" : "Place Order"}
        </button>

        {/* ⭐ OPTION A + D BUTTON (BOTTOM) */}
        <button
          onClick={() => navigate("/")}
          className="
            mt-4 w-full py-3 rounded-xl font-semibold
            border border-purple-300 text-purple-600
            bg-white shadow-sm
            hover:bg-purple-50 hover:border-purple-500
            transition-all active:scale-95
            animate-pulse
          "
        >
          ← Add More Products
        </button>
      </div>
    </>
  );
}
