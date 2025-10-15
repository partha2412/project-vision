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

// Delete order by ID (admin only)
export const deleteOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/order/deleteorder/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
    catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId, payload) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/order/status/${orderId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

