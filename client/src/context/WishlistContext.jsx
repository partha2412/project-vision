import React, { createContext, useState, useEffect } from "react";
import {
  fetchWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
  clearWishlistApi,
} from "../api/wishlistApi";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial fetch
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetchWishlistApi();
      const products = (res.data.products ?? [])
        .map(i => i.product)
        .filter(Boolean);

      setWishlist(products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Optimistic add
  const addToWishlist = async (product) => {
    if (wishlist.some(p => p._id === product._id)) return;

    const previous = structuredClone(wishlist);
    setWishlist(prev => [...prev, product]);

    try {
      await addToWishlistApi(product._id);
    } catch {
      setWishlist(previous);
    }
  };

  // Optimistic remove
  const removeFromWishlist = async (productId) => {
    const previous = structuredClone(wishlist);
    setWishlist(prev => prev.filter(p => p._id !== productId));

    try {
      await removeFromWishlistApi(productId);
    } catch {
      setWishlist(previous);
    }
  };

  // Optimistic remove
  const clearWishlist = async () => {
    const previous = structuredClone(wishlist);
    try {
      setWishlist([]);
      await clearWishlistApi();
    } catch {
      setWishlist(previous);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};