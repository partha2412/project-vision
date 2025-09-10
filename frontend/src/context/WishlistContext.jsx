import React, { createContext, useState } from "react";

// Create context
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Add item if not already in wishlist
  const addToWishlist = (item) => {
    setWishlist((prev) => {
      // prevent duplicates
      if (prev.some((w) => w.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };


  // Remove item
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };


  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};