import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginsuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/check", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        { username, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        window.location.href = "/home"; // Redirect after login
        
      } else {
        setIsAuthenticated(false);
         setLoginSuccess(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setLoginSuccess(true);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      window.location.href = "/api/login"; // Redirect after logout
    } catch (error) {
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loginsuccess }}>
      {children}
    </AuthContext.Provider>
  );
};
