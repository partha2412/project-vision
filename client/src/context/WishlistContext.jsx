import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", config);

      const productsWithImage = res.data.products.map((product) => ({
        ...product,
        image:
          product.image && product.image.startsWith("http")
            ? product.image // Cloudinary or full URL
            : `http://localhost:5000/${product.image || "images/default.jpg"}`, // local fallback
      }));

      setWishlist(productsWithImage);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  useEffect(() => {
    if (token) fetchWishlist();
  }, [token]);

  // Add product to wishlist
  const addToWishlist = async (product) => {
    try {
      const imageUrl =
        product.image && product.image.startsWith("http")
          ? product.image
          : `http://localhost:5000/${product.image || "images/default.jpg"}`;

      const productData = {
        _id: product._id,
        name: product.name || product.title || "Unknown Product",
        price: product.price,
        image: imageUrl,
        description: product.description || "",
      };

      const res = await axios.post(
        "http://localhost:5000/api/wishlist/add",
        { product: productData },
        config
      );

      const productsWithImage = res.data.products.map((p) => ({
        ...p,
        image:
          p.image && p.image.startsWith("http")
            ? p.image
            : `http://localhost:5000/${p.image || "images/default.jpg"}`,
      }));

      setWishlist(productsWithImage);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/wishlist/remove",
        { productId },
        config
      );

      const productsWithImage = res.data.products.map((p) => ({
        ...p,
        image:
          p.image && p.image.startsWith("http")
            ? p.image
            : `http://localhost:5000/${p.image || "images/default.jpg"}`,
      }));

      setWishlist(productsWithImage);
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
