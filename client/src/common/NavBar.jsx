import React, { useContext, useState, useRef, useEffect } from 'react';
import { IoCartOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext'; // ✅ added
import { AuthContext } from '../context/AuthContext';
import { logoutUser } from '../api/userApi';

const NavBar = () => {
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext); // ✅ get cart from context
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get initials (with fallback)
  const getInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstname?.[0]?.toUpperCase() || '';
    const lastInitial = user.lastname?.[0]?.toUpperCase() || '';
    const initials = (firstInitial + lastInitial).trim();

    if (initials === '' && user.email) {
      return user.email[0].toUpperCase();
    }
    return initials || '⚠️';
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <header className="w-full flex items-center p-4 bg-white shadow-md z-50 ">
        {/* Logo */}
        <div
          className="text-2xl md:text-5xl font-extrabold tracking-widest text-gray-900 uppercase cursor-pointer"
          onClick={() => navigate("/")}
        >
          Vision
        </div>

        {/* Navbar */}
        <nav className="flex items-center space-x-2 md:space-x-4 text-black font-medium ml-auto">
          {/* All Products */}
          <Link to="/products" className="relative px-2 py-1 text-sm md:text-base group">
            <span className="relative z-10">All Products</span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Track Order */}
          <button
            className="relative px-2 md:px-3 py-1 rounded-sm group text-sm md:text-base"
            onClick={() => navigate('/userdashboard')}
          >
            <span className="relative z-10">Track Order</span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </button>

          {/* User Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer shadow-md transform hover:scale-105 transition-transform duration-300"
                onClick={() => setOpen(!open)}
              >
                {user?.avatar && user.avatar !== "default-avatar.jpg" ? (
                  <img
                    src={
                      user.avatar.startsWith("http")
                        ? user.avatar
                        : `http://localhost:5000/uploads/${user.avatar}`
                    }
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 text-white flex items-center justify-center font-bold">
                    {getInitials()}
                  </div>
                )}
              </div>


              {open && (
                <div className="absolute right-0 mt-3 w-52 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
                  <div className="absolute top-[-8px] right-4 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>

                  <div className="flex flex-col text-gray-700 text-sm">
                    {isAdmin() ? (
                      <button
                        className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-colors duration-200"
                        onClick={() => { navigate("/admindashboard"); setOpen(false); }}
                      >
                        🛠 Admin Dashboard
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-colors duration-200"
                        onClick={() => { navigate("/userdashboard"); setOpen(false); }}
                      >
                        📊 Dashboard
                      </button>
                    )}

                    <button
                      className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-colors duration-200"
                      onClick={() => { navigate("/orders"); setOpen(false); }}
                    >
                      📦 Orders
                    </button>

                    <button
                      className="flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => { logoutUser(); setOpen(false); navigate("/"); }}
                    >
                      🔓 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="relative py-1 px-2 text-sm md:text-base font-medium group"
              onClick={() => navigate("/login")}
            >
              <div>SignUp & SignIn</div>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          )}

          {/* Wishlist */}
          <button
            className="relative flex py-1 px-2 group"
            onClick={() => navigate("/wishlist")}
          >
            <span className="relative z-10 text-[22px] md:text-[28px] text-gray-700 group-hover:text-red-500 transition-colors duration-300">
              <CiHeart />
            </span>
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>

            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* 🛒 Cart (with live count) */}
          <button
            className="relative py-1 px-2 group"
            onClick={() => navigate("/cart")}
          >
            <span className="relative z-10 text-[22px] md:text-[28px] text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
              <IoCartOutline />
            </span>
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>

            {cart?.totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.totalItems}
              </span>
            )}
          </button>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
