import api from "./axios";

// Helper to get Authorization header
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  const { data } = await api.post(
    "/cart/add",
    { productId, quantity },
    getAuthConfig()
  );
  return data;
};

// ✅ Get current user's cart
export const getCart = async () => {
  const { data } = await api.get("/cart", getAuthConfig());
  return data;
};

// ✅ Update item quantity directly
export const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put(
    "/cart/update",
    { productId, quantity },
    getAuthConfig()
  );
  return data;
};

// ✅ Increment or decrement quantity
export const changeCartItemQuantity = async (productId, increment = true) => {
  const { data } = await api.put(
    "/cart/change-quantity",
    { productId, increment },
    getAuthConfig()
  );
  return data;
};

// ✅ Remove product from cart
export const removeCartItem = async (productId) => {
  const { data } = await api.delete("/cart/remove", {
    ...getAuthConfig(),
    data: { productId },
  });
  return data;
};

// ✅ Clear entire cart
export const clearCart = async () => {
  const { data } = await api.delete("/cart/clear", getAuthConfig());
  return data;
};
