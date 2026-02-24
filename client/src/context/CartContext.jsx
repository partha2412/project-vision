// context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";
import {
  addToCart as apiAddToCart,
  getCart,
  removeCartItem,
  updateCartItem as apiUpdateCartItem,
  changeCartItemQuantity as apiChangeQty,
  clearCart as apiClearCart,
} from "../api/cartApi";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();

      const safeItems = (data.items || []).filter(
        i => i?.product?._id
      );

      setCart({
        items: safeItems,
        totalItems: safeItems.reduce((a, i) => a + i.quantity, 0),
        totalAmount: safeItems.reduce((a, i) => a + i.totalPrice, 0),
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add product to cart (optimistic)
  const addToCart = async (product, quantity = 1) => {
    // 🔥 1. OPTIMISTIC UI UPDATE
    setCart(prev => {
      const items = [...prev.items];
      const index = items.findIndex(i => i.product._id === product._id);

      if (index > -1) {
        items[index] = {
          ...items[index],
          quantity: items[index].quantity + quantity,
          totalPrice:
            (items[index].discountPrice || items[index].price) *
            (items[index].quantity + quantity),
        };
      } else {
        items.push({
          product,
          quantity,
          price: product.price,
          discountPrice: product.discountPrice || 0,
          gstRate: product.gstRate || 0,
          totalPrice: (product.discountPrice || product.price) * quantity,
          image: product.images?.[0] || "",
        });
      }

      return {
        items,
        totalItems: items.reduce((a, i) => a + i.quantity, 0),
        totalAmount: items.reduce((a, i) => a + i.totalPrice, 0),
      };
    });

    // 🔄 2. BACKEND SYNC
    try {
      await apiAddToCart(product._id, quantity);
    } catch (err) {
      console.error(err.message);
      // ❌ 3. ROLLBACK ON FAILURE
      fetchCart();
    }
  };

  const removeFromCart = async (productId) => {

    // 🔥 1️⃣ OPTIMISTIC UI UPDATE
    const previousCart = cart;

    setCart(prev => {
      const items = prev.items.filter(
        i => i.product._id !== productId
      );

      return {
        items,
        totalItems: items.reduce((a, i) => a + i.quantity, 0),
        totalAmount: items.reduce((a, i) => a + i.totalPrice, 0),
      };
    });

    // 🔄 2️⃣ BACKEND SYNC
    try {
      await removeCartItem(productId);
    } catch (err) {
      console.error(err.message);

      // ❌ 3️⃣ ROLLBACK if API fails
      setCart(previousCart);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await apiUpdateCartItem(productId, quantity);
      fetchCart();
    } catch (err) {
      console.error(err.message);
    }
  };

  const changeCartItemQuantity = async (productId, increment = true) => {
    try {
      await apiChangeQty(productId, increment);
      fetchCart();
    } catch (err) {
      console.error(err.message);
    }
  };

  const clearCart = async () => {
    try {
      await apiClearCart();
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        changeCartItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
