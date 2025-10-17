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
export const googleSignup = async (userData) => {
  const response = await fetch("http://localhost:5000/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

