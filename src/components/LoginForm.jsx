import React, { useState, useEffect, useCallback } from "react";
import { User, Lock, ShieldAlert, EyeOff, Eye, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const LoginForm = () => {
  const [ldapId, setLdapId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { auth, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (auth) {
      if (auth.role === "student") {
        navigate("/student/home");
      } else if (auth.role === "admin") {
        navigate("/admin/complaints");
      } else if (auth.role === "cow") {
        navigate("/cow/dashboard");
      } else if (["electric_admin", "internet_admin", "medical_admin"].includes(auth.role)) {
        navigate(`/${auth.role}/complaints`);
      } else if (auth.role?.startsWith("H")) {
        // Warden roles (H1, H2, etc.)
        navigate(`/${auth.role}/warden/dashboard`);
      }
    }
  }, [auth, navigate]);

  const toggleIsAdmin = useCallback(() => {
    setIsAdminLogin(!isAdminLogin);
  }, [isAdminLogin]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!ldapId.trim()) {
      toast.error("Please enter your LDAP ID", { toastId: "ldap-required" });
      return false;
    }
    if (!password.trim()) {
      toast.error("Please enter your password", { toastId: "password-required" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(ldapId, password, isAdminLogin);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-5 sm:p-8 w-full max-w-md mx-auto transition-all duration-300 hover:shadow-blue-900/20 border border-white/50">
      <div className="mb-4 sm:mb-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
          {isAdminLogin ? "Admin Access" : "Student Login"}
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm">
          {isAdminLogin
            ? "Authorized personnel only"
            : "Access your account to manage complaints"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {isAdminLogin && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-3 sm:mb-4 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldAlert className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500" />
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="text-xs sm:text-sm text-yellow-700">
                  This login is restricted to authorized administrative personnel only.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative group">
          <label htmlFor="ldapId" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 ml-1">
            {isAdminLogin ? "Admin ID" : "LDAP ID"}
          </label>
          <div className="flex items-center border-2 rounded-lg group-focus-within:border-blue-500 group-hover:border-gray-300 transition-colors">
            <User className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 ml-3" />
            <input
              type="text"
              id="ldapId"
              value={ldapId}
              onChange={(e) => setLdapId(e.target.value)}
              placeholder={isAdminLogin ? "Enter admin ID" : "Enter LDAP ID"}
              className="w-full p-2 sm:p-3 pl-3 outline-none text-gray-700 bg-transparent text-sm"
              required
            />
          </div>
        </div>

        <div className="relative group">
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 ml-1">
            Password
          </label>
          <div className="flex items-center border-2 rounded-lg group-focus-within:border-blue-500 group-hover:border-gray-300 transition-colors">
            <Lock className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 ml-3" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 sm:p-3 pl-3 outline-none text-gray-700 bg-transparent pr-10 text-sm"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 sm:h-5 w-4 sm:w-5" />
              ) : (
                <Eye className="h-4 sm:h-5 w-4 sm:w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="adminLogin"
              checked={isAdminLogin}
              onChange={toggleIsAdmin}
              className="h-3 sm:h-4 w-3 sm:w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="adminLogin"
              className="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer"
            >
              Admin Login
            </label>
          </div>
          <a
            href="#"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2 text-sm sm:text-base ${isLoading ? "opacity-70 cursor-wait" : ""
            }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
        <p>
          Trouble logging in?{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
