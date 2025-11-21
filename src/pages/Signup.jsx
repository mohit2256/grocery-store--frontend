// src/pages/Signup.jsx
import React, { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { setUser } = useAuth(); // ⭐ Use AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 Sync new user with backend
  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return;

    const token = await firebaseUser.getIdToken(true);

    await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "https://grocery-store-backend-m0xj.onrender.com"}/api/users/sync`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.setItem("fb_token", token);
  };

  // ⭐ EMAIL + PASSWORD SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 1️⃣ Create Firebase user
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Sync with backend
      await syncUserWithBackend(result.user);

      // 3️⃣ Set global user
      setUser(result.user);

      alert("Account created successfully 🎉");
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      await syncUserWithBackend(result.user);

      setUser(result.user);

      alert("Signed up with Google 🎉");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96 text-center animate-fade-in">
        <h2 className="text-2xl font-extrabold text-purple-700 mb-6">
          Create Your Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center justify-center">
          <div className="w-1/3 border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <div className="w-1/3 border-t border-gray-300"></div>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition-all shadow-sm hover:shadow-md"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        {/* Phone Signup */}
        <Link
          to="/phone-login"
          className="block mt-4 text-purple-600 hover:text-purple-800 font-medium transition-all"
        >
          📱 Sign up with Phone Number
        </Link>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-700 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
