import { createContext, useState, useEffect } from "react";
import { loginUser as apiLoginUser, signupUser as apiSignupUser, logoutUser as apiLogoutUser } from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Wrapped login to update context
  const loginUser = async (credentials) => {
    const data = await apiLoginUser(credentials);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  };

  // Wrapped signup (optional, can also update context)
  const signupUser = async (data) => {
    const result = await apiSignupUser(data);
    setUser(result.user);
    localStorage.setItem("user", JSON.stringify(result.user));
    return result;
  };

  // Wrapped logout to clear context
  const logoutUser = () => {
    apiLogoutUser();
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginUser, signupUser, logoutUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
