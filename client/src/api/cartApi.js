import api from "./axios";

// Helper to get Authorization header
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    // 🚫 If no token, throw immediately
    throw new Error("Unauthorized: Please log in to continue");
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
  if (err.response) {
    if (err.response.status === 401) {
      console.error("❌ Unauthorized: Please log in.");
      throw new Error("Unauthorized: Please log in.");
    } else {
      console.error("⚠️ API Error:", err.response.data.message);
      throw new Error(err.response.data.message || "Something went wrong");
    }
  } else if (err.message.includes("Unauthorized")) {
    throw err; // from getAuthConfig
  } else {
    console.error("🚨 Network Error:", err.message);
    throw new Error("Network error. Please try again later.");
  }
};
