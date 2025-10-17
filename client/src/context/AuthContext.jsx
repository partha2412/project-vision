import { createContext, useState, useEffect } from "react";
import {
  loginUser as apiLoginUser,
  signupUser as apiSignupUser,
  logoutUser as apiLogoutUser,
} from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Safely parse localStorage user
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Login wrapper
  const loginUser = async (credentials) => {
    try {
      const data = await apiLoginUser(credentials);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token); // save JWT
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Signup wrapper
  const signupUser = async (data) => {
    try {
      const result = await apiSignupUser(data);
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token); // save JWT
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Logout wrapper
  const logoutUser = () => {
    try {
      apiLogoutUser(); // optional API call
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Check admin
  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, loginUser, signupUser, logoutUser, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
