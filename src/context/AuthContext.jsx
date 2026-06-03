import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../helpers/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUser = (userData) => {
    localStorage.setItem("vit_user", JSON.stringify(userData));
    setUser(userData);
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("vit_user");

      if (!token) {
        setUser(null);
        return null;
      }

      let parsedUser = savedUser ? JSON.parse(savedUser) : null;

      try {
        const freshUser = await apiRequest("/users/me");
        saveUser(freshUser);
        return freshUser;
      } catch {
        if (parsedUser) {
          setUser(parsedUser);
          return parsedUser;
        }
      }

      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loginUser = async (userData, token) => {
    localStorage.setItem("token", token);

    try {
      const freshUser = await apiRequest("/users/me");
      saveUser(freshUser);
    } catch {
      saveUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vit_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logout,
        reloadUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}