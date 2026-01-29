// context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

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
      const res = await api.get("/cart", getAuthConfig());
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add product to cart (optimistic)
  const addToCart = async (product, quantity = 1) => {
    const existingItem = cart.items.find(i => i.product._id === product._id);

    let updatedCart;
    if (existingItem) {
      updatedCart = {
        ...cart,
        items: cart.items.map(i =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity, totalPrice: (i.discountPrice || i.price) * (i.quantity + quantity) }
            : i
        ),
      };
    } else {
      const newItem = {
        product,
        quantity,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        gstRate: product.gstRate || 0,
        totalPrice: (product.discountPrice || product.price) * quantity,
        image: product.images?.[0] || "",

      };
      updatedCart = { ...cart, items: [...cart.items, newItem] };
    }
    updatedCart.totalItems = updatedCart.items.reduce((acc, i) => acc + i.quantity, 0);
    updatedCart.totalAmount = updatedCart.items.reduce((acc, i) => acc + i.totalPrice, 0);

    setCart(updatedCart);

    try {
      await api.post("/cart/add", { productId: product, quantity }, getAuthConfig());
      fetchCart(); // sync with backend
    } catch (err) {
      //console.error("Error adding to cart:", err);
      fetchCart(); // rollback
    }
  };

  // Remove product
  const removeFromCart = async (productId) => {
    const prevCart = { ...cart };
    setCart({
      ...cart,
      items: cart.items.filter(i => i.product._id !== productId),
      totalItems: cart.totalItems - (cart.items.find(i => i.product._id === productId)?.quantity || 0),
      totalAmount: cart.items.reduce(
        (acc, i) => (i.product._id === productId ? acc : acc + i.totalPrice),
        0
      ),
    });

    try {
      await api.delete(`/cart/remove/${productId}`, getAuthConfig());
      fetchCart(); // sync
    } catch (err) {
      console.error("Error removing from cart:", err);
      setCart(prevCart); // rollback
    }
  };

  // Update quantity directly
  const updateCartItem = async (productId, quantity) => {
    try {
      await api.put("/cart/update", { productId, quantity }, getAuthConfig());
      fetchCart();
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  // Increment / decrement quantity
  const changeCartItemQuantity = async (productId, increment = true) => {
    try {
      await api.put("/cart/change-quantity", { productId, increment }, getAuthConfig());
      fetchCart();
    } catch (err) {
      console.error("Error changing cart item quantity:", err);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await api.delete("/cart/clear", getAuthConfig());
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
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
