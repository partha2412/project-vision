import React, { createContext, useState } from "react";

// Create context
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Add item if not already in wishlist
  const addToWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((item) => item.id === product.id) ? prev : [...prev, product]
    );
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