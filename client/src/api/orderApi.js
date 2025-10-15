import api from "./axios";

// Fetch all orders (admin only)
export const fetchAllOrders = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Send request with Authorization header
    const response = await api.get("/order/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// Fetch orders for a specific user