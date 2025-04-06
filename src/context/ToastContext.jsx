import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';

// Create the Toast context
const ToastContext = createContext(null);

// Default toast configuration
const defaultToastOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
};

// Provider component that wraps the app and provides the toast functions
export const ToastProvider = ({ children }) => {
    /**
     * Show a success toast with optional configuration
     * @param {string} message - Message to display
     * @param {Object} options - Additional toast options
     */
    const success = (message, options = {}) => {
        return toast.success(message, {
            ...defaultToastOptions,
            ...options,
        });
    };

    /**
     * Show an error toast with optional configuration
     * @param {string} message - Message to display
     * @param {Object} options - Additional toast options
     */
    const error = (message, options = {}) => {
        return toast.error(message, {
            ...defaultToastOptions,
            ...options,
        });
    };

    /**
     * Show an info toast with optional configuration
     * @param {string} message - Message to display
     * @param {Object} options - Additional toast options
     */
    const info = (message, options = {}) => {
        return toast.info(message, {
            ...defaultToastOptions,
            ...options,
        });
    };

    /**
     * Show a warning toast with optional configuration
     * @param {string} message - Message to display
     * @param {Object} options - Additional toast options
     */
    const warning = (message, options = {}) => {
        return toast.warning(message, {
            ...defaultToastOptions,
            ...options,
        });
    };

    /**
     * Dismiss a specific toast by ID or all toasts
     * @param {string|null} toastId - ID of toast to dismiss, or null to dismiss all
     */
    const dismiss = (toastId = null) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    };

    /**
     * Update an existing toast
     * @param {string} toastId - ID of toast to update
     * @param {Object} options - New toast options
     */
    const update = (toastId, options = {}) => {
        if (!toastId) return;

        return toast.update(toastId, {
            ...options,
        });
    };

    // Toast context value with all available methods
    const contextValue = {
        success,
        error,
        info,
        warning,
        dismiss,
        update,
        // Expose the original toast object in case we need access to other functions
        toast
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook for accessing toast functions
export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === null) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};