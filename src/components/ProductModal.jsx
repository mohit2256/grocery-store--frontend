import React, { useEffect, useState } from "react";

export default function ProductModal({ product, onClose, onNewReview }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("productReviews") || "{}");
    setReviews(all[product.id] || []);
  }, [product.id]);

  const submitReview = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return alert("Please enter name and review.");

    const all = JSON.parse(localStorage.getItem("productReviews") || "{}");
    const list = all[product.id] || [];
    const newRev = {
      id: Date.now(),
      name: name.trim(),
      rating: Number(rating),
      text: text.trim(),
      date: new Date().toISOString(),
    };
    const updated = [...list, newRev];
    all[product.id] = updated;
    localStorage.setItem("productReviews", JSON.stringify(all));
    setReviews(updated);
    setName("");
    setRating(5);
    setText("");
    if (typeof onNewReview === "function") onNewReview(product.id, updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-full md:w-40 h-40 object-cover rounded-lg border"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.category} • {product.unit || ""}</p>
            <p className="text-lg text-purple-700 font-semibold mt-2">₹{product.price}</p>
            <p className="mt-3 text-gray-700">{product.description || "No description available."}</p>

            <div className="mt-4">
              <h4 className="font-semibold">Reviews</h4>
              <div className="max-h-40 overflow-y-auto mt-2 space-y-3">
                {reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="border rounded p-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-sm text-yellow-500">{Array.from({length: r.rating}).map((_,i)=>(<span key={i}>★</span>))}</div>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">{r.text}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(r.date).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add review */}
            <form onSubmit={submitReview} className="mt-4">
              <h4 className="font-semibold mb-2">Leave a review</h4>
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  required
                />
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                >
                  {[5,4,3,2,1].map((n)=>(
                    <option key={n} value={n}>{n} star{n>1?"s":""}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-2 text-sm"
                placeholder="Write your review..."
                rows={3}
                required
              />
              <div className="flex justify-end mt-2">
                <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
