import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";
import student_api from "../api/student-api";
import admin_api from "../api/admin-api";

const WARDEN_ROLES = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12"];

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const getApi = (isAdmin) => {
    const api = isAdmin ? admin_api : student_api;
    return api;
  };

  useEffect(() => {
    const validateAuth = async () => {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth);
          const isAdmin = parsedAuth?.role === 'admin' ||
            parsedAuth?.role === 'electric_admin' ||
            parsedAuth?.role === 'internet_admin' ||
            parsedAuth?.role === 'medical_admin' ||
            parsedAuth?.role === 'cow' ||
            WARDEN_ROLES.includes(parsedAuth?.role);
          const api = getApi(isAdmin);

          const response = await api.get('/validate');

          if (response.data && response.data.status === 'success') {
            setAuth(parsedAuth);
          } else {
            throw new Error('Invalid validation response');
          }
        } catch (error) {
          console.error('Validation error:', error);

          // Clear auth state for all 401 errors
          if (error.response?.status === 401) {
            localStorage.removeItem("auth");
            setAuth(null);

            // Show specific error messages based on the error
            const errorMessage = error.response?.data?.message;
            // Toast already handled by API interceptor
          }
        }
      }
      setIsLoading(false);
    };

    validateAuth();
  }, []);

  const login = async (ldapId, password, isAdmin) => {
    const api = isAdmin ? admin_api : student_api;
    setIsLoading(true);
    try {
      // In the case of the user and the admin the object returned are diff
      const { data } = await api.post("/login", { username: ldapId, password });
      if (data.success) {
        let role = data.role;
        // For admin roles (except warden roles) normalize to lowercase
        if (typeof role === "string" && role && role[0] !== "H") {
          role = role.toLowerCase();
        }
        const authData = isAdmin
          ? { role }
          : {
            userData: data.user,
            role: data.user.role,
            user: data.user
          };
        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
        toast.success('Successfully logged in!', {
          toastId: 'login-success'
        });
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuth(null);
      localStorage.removeItem("auth");
      toast.error(error.response?.data?.message || 'Login failed. Please try again.', {
        toastId: 'login-error'
      });
      throw error.response?.data?.message || error.message || "Authentication failed";
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const isAdmin = auth?.role === 'admin' ||
      auth?.role === 'electric_admin' ||
      auth?.role === 'internet_admin' ||
      auth?.role === 'medical_admin' ||
      auth?.role === 'cow' ||
      WARDEN_ROLES.includes(auth?.role);
    const api = isAdmin ? admin_api : student_api;
    setIsLoading(true);
    try {
      await api.post("/logout");
      toast.info('You have been logged out successfully.', {
        toastId: 'logout-success'
      });
    } catch (error) {
      console.error("Logout error:", error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.', {
          toastId: 'logout-error'
        });
      }
    } finally {
      setAuth(null);
      localStorage.removeItem("auth");
      setIsLoading(false);
      navigate("/");
    }
  };

  // Prevent navigation during loading
  useEffect(() => {
    if (auth === null && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate, isLoading]);

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoading, setIsLoading, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;