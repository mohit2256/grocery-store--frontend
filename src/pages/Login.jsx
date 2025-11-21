// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuth(); // ⭐ from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 Sync user with backend
  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return;

    const token = await firebaseUser.getIdToken(true);

    await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"}/api/users/sync`,
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

  // ⭐ EMAIL + PASSWORD LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1️⃣ Firebase login
      const result = await signInWithEmailAndPassword(auth, email, password);

      // 2️⃣ Sync with backend
      await syncUserWithBackend(result.user);

      // 3️⃣ Update global user
      setUser(result.user);

      alert("Login successful 🎉");
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      await syncUserWithBackend(result.user);

      setUser(result.user);

      alert("Logged in with Google 🎉");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 relative overflow-hidden">

      <div className="absolute w-72 h-72 bg-purple-400/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-fuchsia-400/20 rounded-full blur-3xl bottom-10 right-10 animate-ping"></div>

      <div className="relative z-10 bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl px-8 py-10 w-96 text-center animate-slide-up">

        <h2 className="text-3xl font-extrabold text-purple-700 mb-6 drop-shadow-sm">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 mb-6 text-sm">
          Log in to continue shopping with <strong>Lala & Sons Grocery</strong>
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-5 flex items-center justify-center">
          <div className="w-1/3 border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <div className="w-1/3 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition-all shadow-sm hover:shadow-md"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        <Link
          to="/phone-login"
          className="block mt-4 text-purple-600 hover:text-purple-800 font-medium transition-all"
        >
          📱 Login with Phone Number
        </Link>

        <p className="mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-700 font-semibold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
