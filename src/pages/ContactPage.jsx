import React from "react";
import ownerPhoto from "../assets/owner.jpg"; // ✅ Add Ashish Kushwaha’s photo in src/assets

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-10 px-5 text-gray-800">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Section - Owner Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-purple-700 mb-4">
            Lala & Sons Provision Store
          </h1>
          <p className="text-gray-600 mb-3">
            <strong>Owner Name:</strong> Ashish Kushwaha
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Address:</strong> F 21, Barra - 8, Kanpur, Uttar Pradesh
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Landmark:</strong> Sabzi Mandi Chauraha, near KDMA School
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Phone:</strong> +91 9559095231
          </p>

          <button
            className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-all shadow-md"
            onClick={() => (window.location.href = "tel:+919559095231")}
          >
            📞 Call Now
          </button>
        </div>

        {/* Right Section - Owner Photo */}
        <div className="flex justify-center items-center">
          <img
            src={ownerPhoto}
            alt="Owner"
            className="rounded-2xl shadow-lg object-cover w-72 h-72 border-4 border-purple-200"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-5xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-semibold text-purple-700 mb-2">
          About Us
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
          Welcome to <strong>Lala & Sons Provision Store</strong> — your trusted grocery destination in Kanpur. 
          We pride ourselves on offering the finest quality rice, pulses, flour, and household essentials 
          at honest prices. Established with a focus on convenience and freshness, our mission is to 
          serve every home with love, care, and quality.
        </p>
      </div>
    </div>
  );
}
