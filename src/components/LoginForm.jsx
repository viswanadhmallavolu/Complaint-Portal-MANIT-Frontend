import React from "react";

const LoginForm = () => {
  return (
      <div className="max-lg:min-w-[50%] max-sm:w-2/3 max-[400px]:w-full lg:w-1/3 flex flex-col p-5 bg-white rounded-lg shadow-lg text-violet-500">
        <h1 className="my-6 text-3xl font-semibold text-center">Login</h1>
        <div className="mb-4">
          <input
            className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-violet-400 px-2"
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full py-2 text-blue-500 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-violet-400 px-2"
            type="password"
            placeholder="Password"
          />
        </div>
        <button className="w-full py-2 mt-4 text-white bg-blue-500 rounded-sm hover:bg-blue-600 font-semibold transition-all">
          Sign In
        </button>
    </div>
  );
};

export default LoginForm;
