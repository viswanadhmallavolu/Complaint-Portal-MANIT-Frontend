/// <reference types="vite/client" />
import axios from 'axios';
import { useToast } from "../context/ToastContext";

// Create a function that returns the configured API instance
// This allows us to use the toast context hook inside components
export const createAdminApi = () => {
  const toast = useToast();

  const admin_api = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_API as string,
    withCredentials: true
  });

  admin_api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        const { status, data } = error.response;

        // Handle authentication errors
        if (status === 401) {
          localStorage.clear();
          toast.error('Your session has expired. Please login again.', {
            toastId: 'auth-error', // Prevent duplicate toasts
            onClose: () => window.location.href = '/'
          });
          return Promise.reject(error);
        }

        // Handle server errors with logout flag
        if (status === 500 && data.logout) {
          localStorage.clear();
          toast.error('Server error occurred. You have been logged out.', {
            toastId: 'server-error',
            onClose: () => window.location.href = '/'
          });
          return Promise.reject(error);
        }

        // Handle other common errors
        const errorMessages = {
          400: 'Bad Request. Please check your input.',
          403: 'Access denied. You lack permissions.',
          404: 'Resource not found.',
          500: 'Server error occurred.'
        };

        if (errorMessages[status]) {
          toast.error(errorMessages[status], {
            toastId: `error-${status}`
          });
        }
      }
      return Promise.reject(error);
    }
  );

  return admin_api;
};

// For backward compatibility, export a default instance
// This will use react-toastify directly since it's outside of React context
import { toast } from 'react-toastify';

const admin_api = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API as string,
  withCredentials: true
});

admin_api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        localStorage.clear();
        toast.error('Your session has expired. Please login again.', {
          toastId: 'auth-error', // Prevent duplicate toasts
          onClose: () => window.location.href = '/'
        });
        return Promise.reject(error);
      }

      // Handle server errors with logout flag
      if (status === 500 && data.logout) {
        localStorage.clear();
        toast.error('Server error occurred. You have been logged out.', {
          toastId: 'server-error',
          onClose: () => window.location.href = '/'
        });
        return Promise.reject(error);
      }

      // Handle other common errors
      const errorMessages = {
        400: 'Bad Request. Please check your input.',
        403: 'Access denied. You lack permissions.',
        404: 'Resource not found.',
        500: 'Server error occurred.'
      };

      if (errorMessages[status]) {
        toast.error(errorMessages[status], {
          toastId: `error-${status}`
        });
      }
    }
    return Promise.reject(error);
  }
);

export default admin_api;