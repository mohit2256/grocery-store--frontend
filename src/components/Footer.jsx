import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-800 to-purple-900 text-white pt-10 pb-6 mt-10 shadow-2xl border-t border-purple-700">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* 1️⃣ Brand / About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="text-yellow-400" size={26} />
            <h3 className="text-xl font-bold text-yellow-400">Lala & Sons</h3>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Serving freshness and quality for your home. 
            <br />We’re dedicated to delivering groceries you can trust.
          </p>
        </div>

        {/* 2️⃣ Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-yellow-300 transition">Home</Link></li>
            <li><Link to="/orders" className="hover:text-yellow-300 transition">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-yellow-300 transition">Cart</Link></li>
            <li><Link to="/checkout" className="hover:text-yellow-300 transition">Checkout</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-300 transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* 3️⃣ Popular Searches */}
        <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">Popular Searches</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Fresh Basmati Rice</li>
            <li>Organic Pulses</li>
            <li>Pure Wheat Flour</li>
            <li>Refined Sunflower Oil</li>
            <li>Daily Essentials</li>
          </ul>
        </div>

        {/* 4️⃣ Contact Details */}
        <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">Contact Info</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <MapPin className="text-yellow-400 mt-1" size={18} />
              <span>F 21, Barra - 8, Kanpur, Uttar Pradesh<br />Landmark: Sabzi Mandi Chauraha, near KDMA School</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="text-yellow-400" size={18} />
              <a href="tel:+919559095231" className="hover:text-yellow-300">+91 9559095231</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="text-yellow-400" size={18} />
              <a href="mailto:gyanwati0011@gmail.com" className="hover:text-yellow-300">gyanwati0011@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Icons */}
      <div className="mt-10 border-t border-purple-700 pt-6 text-center">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#" className="hover:text-yellow-400 transition"><Facebook /></a>
          <a href="#" className="hover:text-yellow-400 transition"><Instagram /></a>
          <a href="#" className="hover:text-yellow-400 transition"><Twitter /></a>
        </div>
        <p className="text-gray-400 text-sm">
          © 2025 Lala & Sons Provision Store — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
