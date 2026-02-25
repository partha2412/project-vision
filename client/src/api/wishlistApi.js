// api/wishlistApi.js
import api from "./axios";
import { toast } from "react-toastify";

/* =========================
   Auth Helper
========================= */
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

/* =========================
   Central Error Handler
========================= */
const handleApiError = (err) => {
  // 🔐 Token missing (frontend)
  if (err.code === "AUTH_MISSING") {
    toast.error("Please login to add to Wishlist");
    throw err;
  }

  // 🔐 Unauthorized (backend)
  if (err.response?.status === 401) {
    toast.error("Session expired. Please login again");
    throw err;
  }

  // ⚠️ Backend message
  if (err.response?.data?.message) {
    toast.error(err.response.data.message);
    throw err;
  }

  // 🌐 Network / unknown
  toast.error("Network error. Please try again");
  throw err;
};

/* =========================
   API Calls
========================= */
export const fetchWishlistApi = async () => {
  try {
    return await api.get("/wishlist", getAuthConfig());
  } catch (err) {
    handleApiError(err);
  }
};

export const addToWishlistApi = async (productId) => {
  try {
    return await api.post(
      "/wishlist/add",
      { productId },
      getAuthConfig()
    );
  } catch (err) {
    handleApiError(err);
  }
};

export const removeFromWishlistApi = async (productId) => {
  try {
    return await api.delete(
      `/wishlist/remove/${productId}`,
      getAuthConfig()
    );
  } catch (err) {
    handleApiError(err);
  }
};

export const clearWishlistApi = async () => {
  try {
    return await api.delete(
      "/wishlist/clear",
      getAuthConfig()
    );
  } catch (err) {
    handleApiError(err);
  }
};