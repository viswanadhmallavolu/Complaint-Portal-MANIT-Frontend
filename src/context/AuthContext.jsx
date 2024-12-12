import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import student_api from "../api/student-api";
import admin_api from "../api/admin-api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getApi = (isAdmin) => (isAdmin ? admin_api : student_api);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setIsLoading(false);
  }, []);

  const login = async (ldapId, password, isAdmin) => {
    const api = getApi(isAdmin);
    if (!isAdmin) {
      setIsLoading(true);
      try {
        const { data } = await api.post("/login", { username: ldapId, password });
        if (data.success) {
          const authData = { userData: data.user, role: data.user.role };
          setAuth(authData);
          localStorage.setItem("auth", JSON.stringify(authData));
        } else {
          throw new Error(data.message || "Authentication failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        setAuth(null);
        localStorage.removeItem("auth");
        throw error.response?.data?.message || error.message || "Authentication failed";
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        const { data } = await api.post("/login", { username: ldapId, password });
        if (data.success) {
          const authData = {  role: 'admin' };
          setAuth(authData);
          localStorage.setItem("auth", JSON.stringify(authData));
        } else {
          throw new Error(data.message || "Authentication failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        setAuth(null);
        localStorage.removeItem("auth");
        throw error.response?.data?.message || error.message || "Authentication failed";
      } finally {
        setIsLoading(false);
      }

    }
  };

  const logout = async () => {
    const api = auth?.role === 'admin' ? admin_api : student_api;
    setIsLoading(true);
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
      if (error.response?.status === 401) {
        navigate("/");
      }
    } finally {
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

  useEffect(() => {
    const api = auth?.role === 'admin' ? admin_api : student_api;

    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          setAuth(null);
          localStorage.removeItem("auth");
          toast.error("Session expired");
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, navigate]);

  return (
    <>
      <AuthContext.Provider value={{ auth, login, logout, isLoading, setIsLoading }}>
        {children}
      </AuthContext.Provider>
      <ToastContainer />
    </>
  );
};

export default AuthProvider;