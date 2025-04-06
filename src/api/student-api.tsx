/// <reference types="vite/client" />
import axios from 'axios';
import { useToast } from "../context/ToastContext";

// Create a function that returns the configured API instance with toast context
export const createStudentApi = () => {
    const toast = useToast();

    const student_api = axios.create({
        baseURL: import.meta.env.VITE_STUDENT_API as string,
        withCredentials: true
    });

    student_api.interceptors.response.use(
        response => response,
        error => {
            if (error.response) {
                const { status, data } = error.response;
                const { expired } = data;

                // Handle token not found
                if (status === 401 && data.message === 'Token not found') {
                    localStorage.clear();
                    toast.error('Session ended. Please login again.', {
                        toastId: 'token-not-found',
                        onClose: () => window.location.href = '/'
                    });
                    return Promise.reject(error);
                }

                // Handle invalid/expired token
                if (status === 401 && data.message === 'User is not authenticated') {
                    localStorage.clear();
                    toast.error('Session Expired. Please login again.', {
                        toastId: 'invalid-token',
                        onClose: () => window.location.href = '/'
                    });
                    return Promise.reject(error);
                }

                // Handle authentication errors
                if (status === 401 && expired) {
                    localStorage.clear();
                    toast.error('Your session has expired. Please login again.', {
                        toastId: 'session-expired',
                        onClose: () => window.location.href = '/'
                    });
                    return Promise.reject(error);
                }

                if (status === 401 && expired === null) {
                    localStorage.clear();
                    toast.error('Unauthorized', {
                        toastId: 'unauthorized',
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
                    500: 'Server error occurred.',
                    304: 'Not Modified'
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

    return student_api;
};

// For backward compatibility, export a default instance
import { toast } from 'react-toastify';

const student_api = axios.create({
    baseURL: import.meta.env.VITE_STUDENT_API as string,
    withCredentials: true
});

student_api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const { status, data, message } = error.response;
            const { expired } = data;

            // Handle token not found
            if (status === 401 && data.message === 'Token not found') {
                localStorage.clear();
                toast.error('Session ended. Please login again.', {
                    toastId: 'token-not-found',
                    onClose: () => window.location.href = '/'
                });
                return Promise.reject(error);
            }

            // Handle invalid/expired token
            if (status === 401 && data.message === 'User is not authenticated') {
                localStorage.clear();
                toast.error('Session Expired. Please login again.', {
                    toastId: 'invalid-token',
                    onClose: () => window.location.href = '/'
                });
                return Promise.reject(error);
            }

            // Handle authentication errors
            if (status === 401 && expired) {
                console.error("Session Expired. Please Login Again");
                localStorage.clear();
                toast.error('Your session has expired. Please login again.', {
                    toastId: 'session-expired',
                    onClose: () => window.location.href = '/'
                });
                return Promise.reject(error);
            }

            if (status === 401 && expired === null) {
                localStorage.clear();
                toast.error('Unauthorized', {
                    toastId: 'unauthorized',
                    onClose: () => window.location.href = '/'
                });
                return Promise.reject(error);
            }

            // Handle server errors with logout flag
            if (status === 500 && data.logout) {
                console.log("Logging the user out ");
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
                500: 'Server error occurred.',
                304: 'Not Modified'
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

export default student_api;