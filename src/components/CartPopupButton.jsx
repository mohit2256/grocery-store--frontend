import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPopupButton({ cart }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  // Show the popup whenever an item is added
  useEffect(() => {
    if (cart.length > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [cart]);

  if (!visible) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-slideUp"
      style={{ transition: "all 0.3s ease-in-out" }}
    >
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 active:scale-95 transition-all"
      >
        🛒 View Cart ({totalItems})
      </button>
    </div>
  );
}
