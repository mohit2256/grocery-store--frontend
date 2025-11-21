// src/pages/Success.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Success({ setCart }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  // Strong Confetti Burst
  const launchConfetti = () => {
    const end = Date.now() + 1500;

    (function frame() {
      confetti({
        particleCount: 45,
        startVelocity: 45,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  useEffect(() => {
    setCart([]);
    localStorage.removeItem("cart");

    // Confetti should run AFTER PageTransition finishes
    const timer = setTimeout(() => {
      launchConfetti();
    }, 900); // matches your PageTransition animation

    return () => clearTimeout(timer);
  }, [setCart]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            No Order Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <div className="bg-white shadow-xl p-8 rounded-3xl max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Placed!
        </h2>

        <p className="text-gray-600 mb-6 text-lg">
          Thanks for shopping with us! Your groceries are on the way 🚚💨
        </p>

        <div className="bg-purple-100 border border-purple-300 p-4 rounded-xl mb-6">
          <p className="font-semibold text-purple-700">
            Order ID: <span className="text-black">{order._id || order.id}</span>
          </p>
          <p className="text-gray-700 mt-2">
            Total Paid: ₹{order.totalPrice || order.total}
          </p>
        </div>

        <button
          onClick={() => navigate("/myorders")}
          className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition mb-3"
        >
          View My Orders
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-200 text-black py-3 rounded-xl hover:bg-gray-300 transition"
        >
          Shop More
        </button>
      </div>
    </div>
  );
}
