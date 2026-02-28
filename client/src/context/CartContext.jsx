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
    if (token)
      return { headers: { Authorization: `Bearer ${token}` }, status: "Authenticated" };
    else {
      return { headers: { Authorization: `Bearer ${token}` }, status: "Not Authenticated" };
    }
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add product to cart (optimistic)
  const addToCart = async (product, quantity = 1) => {
    const me = getAuthConfig();
    if (me.status == "Authenticated") {

      // ✅ 2️⃣ ONLY NOW update UI
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
      });}
      try {
        // 🔐 1️⃣ Validate auth + backend FIRST
        await apiAddToCart(product._id, quantity);
      } catch (err) {
        // ❌ API already showed toast
        // ❌ DO NOT update cart
        return;
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
    // 1️⃣ Store previous state for rollback
    const previousCart = cart;

    // 2️⃣ Optimistically update UI
    setCart(prev => {
      const items = prev.items.map(item => {
        if (item.product._id === productId) {
          const newQuantity = increment
            ? item.quantity + 1
            : item.quantity - 1;

          const safeQuantity = newQuantity < 1 ? 1 : newQuantity;

          return {
            ...item,
            quantity: safeQuantity,
            totalPrice:
              (item.discountPrice || item.price) * safeQuantity,
          };
        }
        return item;
      });

      return {
        items,
        totalItems: items.reduce((a, i) => a + i.quantity, 0),
        totalAmount: items.reduce((a, i) => a + i.totalPrice, 0),
      };
    });

    // 3️⃣ Backend sync
    try {
      await apiChangeQty(productId, increment);
    } catch (err) {
      console.error(err.message);

      // 4️⃣ Rollback if failed
      setCart(previousCart);
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
