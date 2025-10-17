import React, { createContext, useState, useEffect } from "react";
import {
  addToCart as addToCartApi,
  getCart as getCartApi,
  updateCartItem as updateCartItemApi,
  changeCartItemQuantity as changeCartItemQuantityApi,
  removeCartItem as removeCartItemApi,
  clearCart as clearCartApi,
} from "../api/cartApi";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCartApi();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // ✅ Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const data = await addToCartApi(productId, quantity);
      setCart(data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // ✅ Update quantity directly
  const updateCartItem = async (productId, quantity) => {
    try {
      const data = await updateCartItemApi(productId, quantity);
      setCart(data);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  // ✅ Increment / Decrement quantity
  const changeCartItemQuantity = async (productId, increment = true) => {
    try {
      const data = await changeCartItemQuantityApi(productId, increment);
      setCart(data);
    } catch (error) {
      console.error("Error changing item quantity:", error);
    }
  };

  // ✅ Remove single product
  const removeFromCart = async (productId) => {
    try {
      const data = await removeCartItemApi(productId);
      setCart(data);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // ✅ Clear entire cart
  const clearCart = async () => {
    try {
      const data = await clearCartApi();
      setCart(data);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
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
