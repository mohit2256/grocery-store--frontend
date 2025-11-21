// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const location = useLocation();
  const { user: firebaseUser, logout } = useAuth();
  const [backendUser, setBackendUser] = useState(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // UI scrolling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FETCH BACKEND USER
  useEffect(() => {
    const fetchBackendUser = async () => {
      try {
        if (!firebaseUser) {
          setBackendUser(null);
          return;
        }

        const token = await firebaseUser.getIdToken(true);

        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (data) setBackendUser(data);

      } catch (error) {
        console.error("❌ Failed to load backend user:", error);
      }
    };

    fetchBackendUser();
  }, [firebaseUser]);

  const displayName =
    backendUser?.name ||
    firebaseUser?.displayName ||
    firebaseUser?.email?.split("@")[0] ||
    "User";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 
      ${isScrolled ? "bg-purple-800 shadow-xl" : "bg-purple-700"}
      `}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">

        {/* LOGO */}
        <h1 className="text-white text-xl font-bold">Lala & Sons Grocery</h1>

        {/* HAMBURGER BUTTON (Mobile Only) */}
        <button
          className="text-white text-3xl md:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <HiMenu />
        </button>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-6 text-white font-medium">

          <li>
            <Link
              to="/"
              className={`${location.pathname === "/" ? "text-yellow-300" : ""} hover:text-yellow-300`}
            >
              Home
            </Link>
          </li>

          {firebaseUser && (
            <li>
              <Link
                to="/myorders"
                className={`${location.pathname === "/myorders" ? "text-yellow-300" : ""} hover:text-yellow-300`}
              >
                My Orders
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/cart"
              className={`${location.pathname === "/cart" ? "text-yellow-300" : ""} hover:text-yellow-300`}
            >
              Cart
            </Link>
          </li>

          <li>
            <Link
              to="/checkout"
              className={`${location.pathname === "/checkout" ? "text-yellow-300" : ""} hover:text-yellow-300`}
            >
              Checkout
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className={`${location.pathname === "/contact" ? "text-yellow-300" : ""} hover:text-yellow-300`}
            >
              Contact
            </Link>
          </li>

          <li className="border-l border-white h-6"></li>

          {/* LOGGED IN USER MENU */}
          {firebaseUser ? (
            <>
              <li className="text-yellow-300 font-semibold">Hi, {displayName}</li>

              {backendUser?.isAdmin && (
                <li>
                  <Link
                    to="/admin/orders"
                    className="px-3 py-1 rounded-md bg-white text-purple-700 hover:bg-yellow-300 hover:text-black transition"
                  >
                    Admin
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/myaccount"
                  className="px-3 py-1 rounded-md bg-white text-purple-700 hover:bg-yellow-300 hover:text-black transition"
                >
                  My Account
                </Link>
              </li>

              <button
                onClick={logout}
                className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-md bg-white text-purple-700 hover:bg-yellow-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="px-3 py-1 rounded-md bg-yellow-400 text-black hover:bg-yellow-300"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* MOBILE SLIDE-IN MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden">
          <div className="fixed top-0 right-0 w-72 h-full bg-[#1b002b] shadow-xl p-6 flex flex-col text-white">

            {/* Close button */}
            <button
              className="text-3xl self-end mb-5"
              onClick={() => setMenuOpen(false)}
            >
              <HiX />
            </button>

            {/* MOBILE MENU ITEMS */}
            <div className="flex flex-col gap-5 text-lg font-medium">

              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

              {firebaseUser && (
                <Link to="/myorders" onClick={() => setMenuOpen(false)}>
                  My Orders
                </Link>
              )}

              <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
              <Link to="/checkout" onClick={() => setMenuOpen(false)}>Checkout</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

              <hr className="border-purple-500/50" />

              {firebaseUser ? (
                <>
                  <p className="text-yellow-300">Hi, {displayName}</p>

                  {backendUser?.isAdmin && (
                    <Link
                      to="/admin/orders"
                      className="bg-white text-purple-700 px-3 py-2 rounded-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}

                  <Link
                    to="/myaccount"
                    className="bg-white text-purple-700 px-3 py-2 rounded-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Account
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="bg-red-500 px-3 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-white text-purple-700 px-3 py-2 rounded-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-yellow-400 text-black px-3 py-2 rounded-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
