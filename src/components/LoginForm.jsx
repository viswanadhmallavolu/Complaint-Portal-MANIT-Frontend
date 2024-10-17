import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const { login,setIsLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password are required");
      setTimeout(() => {
        setError("");
        setUsername("");
        setPassword("");
      }, 3000);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await login(username, password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setTimeout(() => {
        setError("");
        setUsername("");
        setPassword("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:w-1/2 sm:w-[75%] w-full flex flex-col p-5 bg-white rounded-lg shadow-lg text-violet-500">
      <h1 className="my-6 text-3xl font-semibold text-center">Login</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-violet-400 px-2"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Set the username
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-violet-400 px-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Set the password
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 text-white bg-blue-500 rounded-sm hover:bg-blue-600 font-semibold transition-all"
        >
          Sign In
        </button>
        {error ? (
          <div className="text-red-500 text-center mt-4">{error}</div>
        ) : (
          <div className="text-red-500 text-center mt-4"></div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
