import api from "./axios";

// Helper to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Get all notifications (protected)
export const fetchNotifications = async () => {
  try {
    const response = await api.get("/notifications/");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Create a new notification (Admin only, protected)
export const createNotification = async (notificationData) => {
  try {
    const response = await api.post("/notifications/create", notificationData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Mark notification as read (protected)
export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.put(`/notifications/read/${id}`, {}, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Delete notification (Admin only, protected)
export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/delete/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
