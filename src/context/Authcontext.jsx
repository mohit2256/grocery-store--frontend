// src/context/Authcontext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ⭐ Global user state
  const [user, setUser] = useState(null);

  // ⭐ For showing loading screens while checking auth
  const [loading, setLoading] = useState(true);

  // 🔥 Firebase listener — runs once when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User logged in
        setUser(firebaseUser);

        // Optional: auto refresh token
        await firebaseUser.getIdToken(true);
      } else {
        // User logged out
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ⭐ GLOBAL LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("fb_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // ⭐ Now Login.jsx + Signup.jsx can use this
        loading,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
