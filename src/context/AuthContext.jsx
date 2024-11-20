import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true // This is important for handling cookies
});

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
      const response = await api.post("/login", {
        username: ldapId,
        password: password
      });

      if (response.data.success) {
        const authData = {
          userData: response.data.user,
          role: response.data.user.role
        };

        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
      } else {
        throw new Error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuth(null);
      localStorage.removeItem("auth");
      throw error.response?.data?.message || error.message || "Authentication failed";
    } finally {
      setIsLoading(false);
    }
  };

  // Updated logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Send POST request to /logout endpoint
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, handle the error (e.g., display a notification)
    } finally {
      // Clear authentication state
      setAuth(null);
      localStorage.removeItem("auth");
      setIsLoading(false);
      navigate("/");
    }
  };

  useEffect(() => {
    if (auth === null && !isLoading) {
      navigate("/");
    }
  }, [auth, navigate, isLoading]);

  // Add axios interceptor to handle token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token expiration
          setAuth(null);
          localStorage.removeItem("auth");
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptors
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, navigate]);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;