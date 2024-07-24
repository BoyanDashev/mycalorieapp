// AuthProvider.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post("/refresh-token", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken);
  } catch (error) {
    console.error("Failed to refresh token", error.message);
    // Handle token refresh failure
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const refreshTokenIfNeeded = async () => {
      const token = localStorage.getItem("token");
      // Add token expiration check logic here if needed
      if (token) await refreshAccessToken();
    };

    refreshTokenIfNeeded();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
