import React, { useContext, useState, useRef, useEffect } from 'react';
import { IoCartOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { logoutUser } from '../api/userApi';

const NavBar = () => {
  const { wishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext); // added logout
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get initials
  const getInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstname?.charAt(0).toUpperCase() || '';
    const lastInitial = user.lastname?.charAt(0).toUpperCase() || '';
    return firstInitial + lastInitial;
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

          {/* User Circle Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center cursor-pointer font-bold"
                onClick={() => setOpen(!open)}
              >
                {getInitials()}
              </div>

              {open && (
                <div className="absolute right-[-66px] mt-6 w-44 bg-gray-200  opacity-90 shadow-lg rounded-md overflow-hidden z-50">
                  {/* Admin Dashboard */}
                  {user.role == "admin" ? (
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 duration-300"
                      onClick={() => { navigate("/admindashboard"); setOpen(false); }}
                    >
                      Admin Dashboard
                    </button>
                  ) : (
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-300 duration-300"
                      onClick={() => { navigate("/userdashboard"); setOpen(false); }}
                    >
                      Dashboard
                    </button>
                  )}



                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-300 duration-300"
                    onClick={() => { navigate("/orders"); setOpen(false); }}
                  >
                    Orders
                  </button>

                  <button
                    className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-500 hover:bg-gray-300 duration-300"
                    onClick={() => { logoutUser(); setOpen(false); navigate("/"); }}
                  >
                    Logout
                  </button>
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
          <button className="relative flex py-1 px-2 group" onClick={() => navigate("/wishlist")}>
            <span className="relative z-10 text-[22px] md:text-[28px]">
              <CiHeart />
            </span>
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button className="relative py-1 px-2 group" onClick={() => navigate("/cart")}>
            <span className="relative z-10 text-[22px] md:text-[28px]">
              <IoCartOutline />
            </span>
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>
          </button>

        </nav>
      </header>
    </div>
  );
};

export default NavBar;
