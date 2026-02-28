import api from "./axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper to get Authorization header
// api/cartApi.js
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    const err = new Error("AUTH_MISSING");
    err.code = "AUTH_MISSING";
    throw err;
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const { data } = await api.post(
      "/cart/add",
      { productId, quantity },
      getAuthConfig()
    );
    return data;
  } catch (err) {
    handleApiError(err);
  }
};

// ✅ Get current user's cart
export const getCart = async () => {
  try {
    const { data } = await api.get("/cart", getAuthConfig());
    return data;
  } catch (err) {
    handleApiError(err);
  }
};

// ✅ Update item quantity directly
export const updateCartItem = async (productId, quantity) => {
  try {
    const { data } = await api.put(
      "/cart/update",
      { productId, quantity },
      getAuthConfig()
    );
    return data;
  } catch (err) {
    handleApiError(err);
  }
};

// ✅ Increment or decrement quantity
export const changeCartItemQuantity = async (productId, increment = true) => {
  try {
    const { data } = await api.put(
      "/cart/change-quantity",
      { productId, increment },
      getAuthConfig()
    );
    return data;
  } catch (err) {
    handleApiError(err);
  }
};

// ✅ Remove product from cart
export const removeCartItem = async (productId) => {
  try {
    const { data } = await api.delete(`/cart/remove/${productId}`, {
      ...getAuthConfig(),
      data: { productId },
    });
    return data;
  } catch (err) {
    handleApiError(err);
  }
};

// ✅ Clear entire cart
export const clearCart = async () => {
  try {
    const { data } = await api.delete("/cart/clear", getAuthConfig());
    return data;
  } catch (err) {
    handleApiError(err);
  }
};

// ✅ Centralized error handler
const handleApiError = (err) => {
  // 🔐 Token missing
  if (err.code === "AUTH_MISSING") {
    toast.error("Please login to add to Cart");
    throw err;
  }

  // 🔐 Backend unauthorized
  if (err.response?.status === 401) {
    toast.error("Session expired. Please login again");
    throw err;
  }

  // ⚠️ Other API errors
  if (err.response?.data?.message) {
    toast.error(err.response.data.message);
    throw new Error(err.response.data.message);
  }

  // 🌐 Network error
  toast.error("Network error. Please try again");
  throw err;
};
