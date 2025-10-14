// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // store logged in user data
    const [loading, setLoading] = useState(true);

    // When app loads, check if user info is stored in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, signupUser,  }}>
            {children}
        </AuthContext.Provider>
    );
};
