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
// loginData: { email, password, secretkey (optional) }
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    // Backend returns { success, message, role, token, user }
    return response.data;
  } catch (error) {
    // Return backend error message or network error
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
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
// Update user profile
export const updateUser = async (userData) => {
  try {
    let response;

    // Prepare data
    if (userData.image) {
      // Use FormData if there's an image
      const formData = new FormData();
      for (const key in userData) {
        if (userData[key] !== undefined && userData[key] !== null && userData[key] !== "") {
          if (key === "image") {
            formData.append("image", userData.image); // ✅ must match backend multer field
          } else {
            formData.append(key, userData[key]);
          }
        }
      }

      response = await api.put("/auth/updateuser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } else {
      // Send JSON for normal updates
      const payload = {};
      for (const key in userData) {
        if (userData[key] !== undefined && userData[key] !== null && userData[key] !== "") {
          payload[key] = userData[key];
        }
      }

      response = await api.put("/auth/updateuser", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

