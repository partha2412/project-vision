import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: getAuthHeaders(),
      });
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity },
        { headers: getAuthHeaders() }
      );
      setCart(data);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, quantity },
        { headers: getAuthHeaders() }
      );
      setCart(data);
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  const changeCartItemQuantity = async (productId, increment = true) => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/cart/change-quantity",
        { productId, increment },
        { headers: getAuthHeaders() }
      );
      setCart(data);
    } catch (err) {
      console.error("Error changing cart item quantity:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
  headers: getAuthHeaders()
});

      setCart(data);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: getAuthHeaders(),
      });
      setCart(data);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        changeCartItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
