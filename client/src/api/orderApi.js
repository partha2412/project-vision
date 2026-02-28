import api from "./axios";

// Fetch all orders (admin only)
export const fetchAllOrders = async () => {
  try {
    const token = localStorage.getItem("token");
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
export const fetchUserOrders = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    //console.log(userId);
    
    const response = await api.get(`/order/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // optional: if you protect the route
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Delete order by ID (admin only)
export const placeOrder = async (orderData) => {
  try {
    // console.log(orderData);
    
    const token = localStorage.getItem("token");
    const response = await api.post(`/order/create`,orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    //console.log(response);
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

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
  } catch (error) {
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
