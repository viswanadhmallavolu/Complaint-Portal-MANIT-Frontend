import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        userData: {},
        token: "",
        role:"admin"
  });
  const [isLoading, setIsLoading] = useState(false);
  const login = async (ldapId, password) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ldapId, password }),
      });

      const result = await response.json();
      if (response.ok) {
          setAuth({ userData: result.user, token: result.token, role: result.role });
      } else {
        throw new Error(result.error || "Authentication failed");
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
  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
