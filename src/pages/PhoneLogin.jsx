// src/pages/PhoneLogin.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 Sync user with backend after Firebase login
  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return;

    const token = await firebaseUser.getIdToken(true); // fresh token

    await fetch("/api/users/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.setItem("fb_token", token);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Setup invisible Recaptcha
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );

      const appVerifier = window.recaptchaVerifier;

      // 2️⃣ Send OTP to phone
      const result = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        appVerifier
      );

      setConfirmationResult(result);
      alert("OTP sent successfully 📩");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!confirmationResult) {
        alert("Please request OTP first.");
        return;
      }

      // 3️⃣ Verify OTP
      const result = await confirmationResult.confirm(otp);

      // 4️⃣ Sync user with backend
      await syncUserWithBackend(result.user);

      alert("Phone login successful 🎉");

      // 5️⃣ Redirect home
      navigate("/");
    } catch (error) {
      alert("Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 relative">
      
      {/* Background Effects */}
      <div className="absolute w-72 h-72 bg-purple-400/30 rounded-full blur-3xl top-12 left-12 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-fuchsia-400/20 rounded-full blur-3xl bottom-12 right-12 animate-ping"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md w-96 p-8 rounded-3xl shadow-2xl text-center animate-slide-up">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-4">
          Phone Login 📱
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Login securely with your mobile number
        </p>

        {/* Recaptcha Container (hidden) */}
        <div id="recaptcha-container"></div>

        {!confirmationResult ? (
          <>
            {/* Step 1: Enter Phone Number */}
            <form onSubmit={sendOtp} className="space-y-4">
              <input
                type="tel"
                placeholder="Enter phone number (10 digits)"
                maxLength="10"
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                required
              />

              <button
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all shadow-md active:scale-95"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Step 2: Enter OTP */}
            <form onSubmit={verifyOtp} className="space-y-4">
              <input
                type="text"
                placeholder="Enter the OTP"
                maxLength="6"
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none tracking-widest text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />

              <button
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all shadow-md active:scale-95"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        <button
          onClick={() => navigate("/login")}
          className="mt-6 text-purple-600 hover:text-purple-800 font-medium transition-all"
        >
          ← Go back to Login
        </button>
      </div>
    </div>
  );
}
