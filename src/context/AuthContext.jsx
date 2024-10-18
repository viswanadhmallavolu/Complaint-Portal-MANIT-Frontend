import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setIsLoading(false);
  }, []);

  const login = async (ldapId, password) => {
    setIsLoading(true);
    try {
      // try {
      // const response = await fetch("/api/authenticate", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ ldapId, password }),
      // });

      // const result = await response.json();
      // if (response.ok) {
      //     setAuth({ userData: result.user, token: result.token, role: result.role });
      // } else {
      //   throw new Error(result.error || "Authentication failed");
      // }
      // Mock-Auth
      let authData;
      if (ldapId === "student" && password === "123") {
        authData = {
          userData: { ldapId, name: "Student User" },
          token: "student-token",
          role: "student",
        };
      } else if (ldapId === "admin" && password === "123") {
        authData = {
          userData: { ldapId, name: "Admin User" },
          token: "admin-token",
          role: "admin",
        };
      } else {
        throw new Error("Authentication failed");
      }

      setAuth(authData);
      localStorage.setItem("auth", JSON.stringify(authData));
    }
    catch (error) {
      console.error("Login error:", error);
      setAuth(null);
      localStorage.removeItem("auth");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    navigate("/");
  };

  useEffect(() => {
    if (auth === null && !isLoading) {
      navigate("/");
    }
  }, [auth, navigate, isLoading]);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};