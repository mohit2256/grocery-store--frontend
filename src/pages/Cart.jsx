import { Link } from "react-router-dom";

export default function CartPage({ cart, setCart }) {
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="min-h-[80vh] bg-[#f8f5ff] p-4 sm:p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center gap-2">
        Cart 🛒
      </h2>

      {cart.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-500 mb-4 text-lg">Your cart is empty.</p>
          <Link to="/">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 active:scale-95 transition-all">
              Go Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 sm:p-6">
          {/* Cart Items */}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-gray-200 py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-green-600 font-bold">₹{item.price}</p>
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 active:scale-95"
                >
                  −
                </button>
                <span className="font-semibold text-gray-700">{item.qty}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* Total Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 border-t pt-4">
            <p className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
              Total: <span className="text-purple-700 font-bold">₹{total}</span>
            </p>

            <Link to="/checkout" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 active:scale-95 transition-all font-semibold">
                Proceed to Checkout →
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}







