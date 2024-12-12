import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

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
    <div className="flex flex-col p-5 bg-white rounded-lg shadow-lg text-violet-500">
      <h1 className="my-6 text-3xl font-semibold text-center">Login</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-violet-400 px-2"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-violet-400 px-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="admin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="admin" className="text-blue-500">Login as Admin</label>
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 text-white bg-blue-500 rounded-sm hover:bg-blue-600 font-semibold transition-all"
        >
          {isLoading ? "Logging In..." : "Log In"}
        </button>
        {error && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}
        <div className="text-center mt-4">
          <a href="https://userid.manit.ac.in/" className="text-blue-500 hover:underline" target="_blank">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
