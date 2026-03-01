import api from "./axios"; // your axios instance

// 1. Get sales overview (total revenue, orders, users etc.)
export const getSalesOverview = async () => {
  try {
    const response = await api.get("/admin/analytics/sales", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// 2. Get revenue breakdown by category
export const getRevenueByCategory = async () => {
  try {
    const response = await api.get("/admin/analytics/revenue-by-category", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// 3. Get orders distribution (pending, delivered, cancelled etc.)
export const getOrdersDistribution = async () => {
  try {
    const response = await api.get("/admin/analytics/orders-status", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};