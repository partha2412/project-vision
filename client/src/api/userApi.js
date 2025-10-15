import api from "./axios";

// Signup function
export const signupUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// Login function
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

//Logout function
export const logoutUser = async () => {
  try {
    const response = await api.get("/auth/logout");
    if (response.data.success) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/"; // full reload
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

//update user profile
export const updateUser = async (userData, token) => {
  try {
    const formData = new FormData();
    for (const key in userData) {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    }

    const response = await api.put("/auth/updateuser", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};