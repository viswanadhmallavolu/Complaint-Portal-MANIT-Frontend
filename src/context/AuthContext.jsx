import React, { createContext, useState,useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (ldapId, password) => {
    setIsLoading(true);
    try {
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
      if (ldapId === "student" && password === "123") {
        setAuth({
          userData: {},
          token: "",
          role: "student",
        });
      } else if (ldapId === "admin" && password === "123") {
        setAuth({
          userData: {},
          token: "",
          role: "admin",
        });
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuth(null);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setAuth(null);
  };
  useEffect(() => {
    if (auth === null) {
      navigate("/");
    }
  }, [auth, navigate]);
  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
