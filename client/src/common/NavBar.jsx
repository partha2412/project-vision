import React, { useContext, useState, useRef, useEffect } from 'react';
import { IoCartOutline, IoCloseOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { getme, logoutUser } from '../api/userApi';

const NavBar = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext);
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = () => {
  if (!userDetails) return '';
  const firstInitial = userDetails.firstname?.[0]?.toUpperCase() || '';
  const lastInitial = userDetails.lastname?.[0]?.toUpperCase() || '';
  const initials = (firstInitial + lastInitial).trim();
  if (initials === '' && userDetails.email) return userDetails.email[0].toUpperCase();
  return initials || '?';
};

  useEffect(() => {
    const loadUser = async () => {
      // const userData = JSON.parse(localStorage.getItem('user'));
      const data = await getme();
      setUserDetails(data);
    };
    loadUser();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">

      {/* Main bar */}
      <div className="flex items-center p-4">

        {/* Logo */}
        <button
          className="text-2xl md:text-5xl font-extrabold tracking-widest text-gray-900 uppercase cursor-pointer"
          onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          Vision
        </button>

        {/* ───── DESKTOP NAV ───── */}
        <nav className="hidden md:flex items-center space-x-4 text-black font-medium ml-auto">
          <Link to="/products" className="relative px-2 py-1 group">
            <span className="relative z-10">All Products</span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <button className="relative px-2 py-1 group" onClick={() => navigate('/userdashboard')}>
            <span className="relative z-10">Track Order</span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer shadow-md hover:scale-105 transition-transform duration-300"
                onClick={() => setOpen(!open)}
              >
                {/* Image */}
                {userDetails?.avatar && userDetails.avatar !== "default-avatar.jpg" ? (
                  <img
                    src={userDetails.avatar.startsWith("http") ? userDetails.avatar : `http://localhost:5000/uploads/${userDetails.avatar}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.jpg"; }}
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
                      <button className="flex flex-col items-start w-full gap-2 px-5 pt-3 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-colors duration-200"
                        onClick={() => { navigate("/admindashboard"); setOpen(false); }}>
                        <span>🛠 Admin Dashboard</span>
                        <span className="text-[14px] text-gray-400 pb-3">{user.email}</span>
                      </button>
                    ) : (
                      <button className="flex flex-col items-start w-full gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-colors duration-200"
                        onClick={() => { navigate("/userdashboard"); setOpen(false); }}>
                        📊 Dashboard
                        <span className="text-[14px] text-gray-400 pb-3">{user.email}</span>
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-colors duration-200"
                      onClick={() => { navigate("/userdashboard"); setOpen(false); }}>
                      📦 Orders
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => { logoutUser(); setOpen(false); navigate("/"); }}>
                      🔓 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="relative py-1 px-2 font-medium group" onClick={() => navigate("/login")}>
              <div>SignUp & SignIn</div>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          )}

          <button className="relative flex py-1 px-2 group" onClick={() => navigate("/wishlist")}>
            <span className="text-[28px] text-gray-700 group-hover:text-red-500 transition-colors duration-300"><CiHeart /></span>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>
            )}
          </button>

          <button className="relative py-1 px-2 group" onClick={() => navigate("/cart")}>
            <span className="text-[28px] text-gray-500 group-hover:text-blue-500 transition-colors duration-300"><IoCartOutline /></span>
            {cart?.totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{cart.totalItems}</span>
            )}
          </button>
        </nav>

        {/* ───── MOBILE RIGHT SIDE ───── */}
        <div className="flex md:hidden items-center gap-4 ml-auto">
          <button className="relative" onClick={() => navigate("/wishlist")}>
            <span className="text-[26px] text-gray-700"><CiHeart /></span>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{wishlist.length}</span>
            )}
          </button>

          <button className="relative" onClick={() => navigate("/cart")}>
            <span className="text-[26px] text-gray-500"><IoCartOutline /></span>
            {cart?.totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">{cart.totalItems}</span>
            )}
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[28px] text-gray-700">
            {menuOpen ? <IoCloseOutline /> : <RxHamburgerMenu />}
          </button>
        </div>

      </div>

      {/* ───── MOBILE DROPDOWN ───── */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-white border-t duration-300 border-gray-100 px-6 py-4 gap-4 text-gray-800 font-medium">
          <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-black transition-colors">
            All Products
          </Link>
          <button className="text-left hover:text-black transition-colors"
            onClick={() => { navigate('/userdashboard'); setMenuOpen(false); }}>
            Track Order
          </button>

          {user ? (
            <>
              <button className="text-left hover:text-black transition-colors"
                onClick={() => { navigate(isAdmin() ? "/admindashboard" : "/userdashboard"); setMenuOpen(false); }}>
                {isAdmin() ? "🛠 Admin Dashboard" : "📊 Dashboard"}
              </button>
              <button className="text-left hover:text-black transition-colors"
                onClick={() => { navigate("/userdashboard"); setMenuOpen(false); }}>
                📦 Orders
              </button>
              <button className="text-left text-red-500 hover:text-red-600 transition-colors"
                onClick={() => { logoutUser(); setMenuOpen(false); navigate("/"); }}>
                🔓 Logout
              </button>
            </>
          ) : (
            <button className="text-left hover:text-black transition-colors"
              onClick={() => { navigate("/login"); setMenuOpen(false); }}>
              SignUp & SignIn
            </button>
          )}
        </div>
      )}

    </header>
  );
};

export default NavBar;