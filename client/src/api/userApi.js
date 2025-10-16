import api from "./axios"; // your configured Axios instance

// Signup function
export const signupUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Google signup function (corrected)
export const googleSignup = async (token) => {
  try {
    const res = await api.post("/auth/google", { token }); 
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Google signup failed");
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

// Logout function
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
