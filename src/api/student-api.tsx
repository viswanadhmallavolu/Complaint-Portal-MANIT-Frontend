import axios from 'axios';
import { toast } from 'react-toastify';

const student_api = axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true
});

student_api.interceptors.response.use(
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