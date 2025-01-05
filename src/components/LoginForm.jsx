import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password are required");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      setError("");
      await login(username, password, isAdmin);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col p-8 rounded-xl shadow-xl bg-white/10 backdrop-blur-md backdrop-filter border border-white/20 text-violet-500">
      <h1 className="my-6 text-3xl font-semibold text-center text-white">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <input
            className="w-full py-3 px-4 text-white bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 placeholder-white/50 backdrop-blur-sm transition-all"
            type="text"
            placeholder="Scholar Number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="scholar-number"
          />
        </div>
        <div className="relative group">
          <input
            className="w-full py-3 px-4 text-white bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 placeholder-white/50 backdrop-blur-sm transition-all"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="admin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mr-2 rounded border-white/20 bg-white/5"
          />
          <label htmlFor="admin" className="text-white/90">Login as Admin</label>
        </div>
        <button
          type="submit"
          className="w-full py-3 text-white bg-blue-600/80 hover:bg-blue-400/80 rounded-lg backdrop-blur-sm font-semibold transition-all"
        >
          {isLoading ? "Logging In..." : "Log In"}
        </button>
        {error && (
          <div className="text-red-400 text-center">{error}</div>
        )}
        <div className="text-center">
          <a 
            href="https://userid.manit.ac.in/" 
            className="text-white/90 hover:text-white transition-colors" 
            target="_blank"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
