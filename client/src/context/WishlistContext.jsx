// context/WishlistContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get("/wishlist", getAuthConfig());
      const products = (res.data.products ?? [])
        .map(item => item.product)
        .filter(Boolean); // 🔥 removes null / undefined
      //console.log(products);

      setWishlist(products);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add product (optimistic update)
  const addToWishlist = async (product) => {
    if (wishlist.some(p => p._id === product._id)) return;

    // Optimistic UI update
    setWishlist(prev => [...prev, product]);

    try {
      await api.post("/wishlist/add", { productId: product._id }, getAuthConfig());
      // optionally refetch to sync backend data
      fetchWishlist();
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setWishlist(prev => prev.filter(p => p._id !== product._id)); // rollback
    }
  };

  // Remove product (optimistic update)
  const removeFromWishlist = async (productId) => {
    const prevWishlist = [...wishlist];
    setWishlist(prev => prev.filter(p => p._id !== productId));

    try {
      await api.delete(`/wishlist/remove/${productId}`, getAuthConfig());
      fetchWishlist(); // sync with backend
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setWishlist(prevWishlist); // rollback
    }
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
