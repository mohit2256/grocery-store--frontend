// src/App.js
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import CartPopupButton from "./components/CartPopupButton";
import Home from "./pages/home";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import MyOrders from "./pages/MyOrders";
import PaymentPage from "./pages/PaymentPage";

import Navbar from "./components/Navbar";
import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PhoneLogin from "./pages/PhoneLogin";
import ContactPage from "./pages/ContactPage";
import Footer from "./components/Footer";
import TokenLogger from "./components/TokenLogger";

import { MyAccount } from "./pages/MyAccount";
import { EditProfile } from "./pages/EditProfile";
import AddressBook from "./pages/AddressBook";
import { AddEditAddress } from "./pages/AddEditAddress";
import { AccountSettings } from "./pages/AccountSettings";

import PageTransition from "./components/PageTransition";

// Admin
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminOrderView from "./admin/AdminOrderView";
import AdminProducts from "./admin/AdminProducts";
import AdminLayout from "./admin/AdminLayout";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="hero flex flex-col items-center justify-center py-10 px-4 sm:py-16 sm:px-8 text-center">
      <div className="hero-content max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-300 mb-3">
          Fresh Groceries, Delivered Fast 🛒
        </h1>

        <p className="text-gray-100 text-base sm:text-lg mb-4">
          Order your daily essentials and get them delivered within minutes!
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-3 bg-purple-600 text-white px-5 py-2 sm:px-7 sm:py-3 rounded-lg hover:bg-purple-700"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}

export default function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <TokenLogger />

      {/* Hide Navbar on admin pages */}
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && location.pathname === "/" && <HeroSection />}

      <Routes>
        {/* Store Pages */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Home cart={cart} setCart={setCart} />
            </PageTransition>
          }
        />

        <Route
          path="/cart"
          element={
            <PageTransition>
              <CartPage cart={cart} setCart={setCart} />
            </PageTransition>
          }
        />

        <Route
          path="/checkout"
          element={
            <PageTransition>
              <Checkout cart={cart} setCart={setCart} />
            </PageTransition>
          }
        />

        <Route
          path="/success"
          element={
            <PageTransition>
              <Success setCart={setCart} />
            </PageTransition>
          }
        />

        

        <Route
          path="/myorders"
          element={
            <PageTransition>
              <MyOrders />
            </PageTransition>
          }
        />

        {/* Auth */}
        <Route
          path="/payment"
          element={
            <PageTransition>
              <PaymentPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <Signup />
            </PageTransition>
          }
        />
        <Route
          path="/phone-login"
          element={
            <PageTransition>
              <PhoneLogin />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          }
        />

        {/* My Account */}
        <Route
          path="/account"
          element={
            <PageTransition>
              <MyAccount />
            </PageTransition>
          }
        />

        <Route
          path="/myaccount"
          element={
            <PageTransition>
              <MyAccount />
            </PageTransition>
          }
        />

        <Route
          path="/account/edit"
          element={
            <PageTransition>
              <EditProfile />
            </PageTransition>
          }
        />
        <Route
          path="/account/addresses"
          element={
            <PageTransition>
              <AddressBook />
            </PageTransition>
          }
        />
        <Route
          path="/account/addresses/add"
          element={
            <PageTransition>
              <AddEditAddress />
            </PageTransition>
          }
        />
        <Route
          path="/account/settings"
          element={
            <PageTransition>
              <AccountSettings />
            </PageTransition>
          }
        />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderView />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
      </Routes>

      {/* Hide Cart button on success page */}
      {!isAdminRoute && location.pathname !== "/success" && (
        <CartPopupButton cart={cart} />
      )}

      {/* Footer hidden on admin */}
      {!isAdminRoute && <Footer />}
    </>
  );
}
