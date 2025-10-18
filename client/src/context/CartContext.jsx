import React, { createContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  changeCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../api/cartApi";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
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

  // ✅ Add product to cart
  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const data = await addToCart(productId, quantity);
      setCart(data);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // ✅ Update product quantity directly
  const handleUpdateCartItem = async (productId, quantity) => {
    try {
      const data = await updateCartItem(productId, quantity);
      setCart(data);
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  // ✅ Increment or decrement quantity
  const handleChangeQuantity = async (productId, increment = true) => {
    try {
      const data = await changeCartItemQuantity(productId, increment);
      setCart(data);
    } catch (err) {
      console.error("Error changing cart item quantity:", err);
    }
  };

  // ✅ Remove product from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      const data = await removeCartItem(productId);
      setCart(data);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // ✅ Clear entire cart
  const handleClearCart = async () => {
    try {
      const data = await clearCart();
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
        addToCart: handleAddToCart,
        updateCartItem: handleUpdateCartItem,
        changeCartItemQuantity: handleChangeQuantity,
        removeFromCart: handleRemoveFromCart,
        clearCart: handleClearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
