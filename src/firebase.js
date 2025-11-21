// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Paste your Firebase config here:
const firebaseConfig = {
  apiKey: "AIzaSyBJWcUOXaV3qVWFT4pWxChT81talJxiEHM",
  authDomain: "grocerystore-d8927.firebaseapp.com",
  projectId: "grocerystore-d8927",
  storageBucket: "grocerystore-d8927.firebasestorage.app",
  messagingSenderId: "1023545344651",
  appId: "1:1023545344651:web:18ce007afeaf8a5d47ca8e",
  measurementId: "G-JNZ0Z70099"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// ✅ Correct exports (required for your PhoneLogin.jsx)
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
