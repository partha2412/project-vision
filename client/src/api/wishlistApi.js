import api from "./axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Get wishlist
export const getWishlist = async () => {
  const res = await api.get("/wishlist", getAuthConfig());
  return res.data;
};

// ✅ Add to wishlist
export const addToWishlist = async (productId) => {
  const res = await api.post("/wishlist/add", { productId }, getAuthConfig());
  return res.data;
};

// ✅ Remove from wishlist
export const removeFromWishlist = async (productId) => {
  const res = await api.delete(`/wishlist/remove/${productId}`, getAuthConfig());
  return res.data;
};
