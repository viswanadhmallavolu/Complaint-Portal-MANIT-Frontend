import React from "react";
import LoginForm from "../components/LoginForm";
const Login = () => {
  return (
    <div className="min-h-[50vw] p-8 w-full flex justify-center items-start bg-[#1261A0]">
      <div className="max-w-[1200px] sm:mt-16 grid max-sm:grid-cols-1 grid-cols-2 max-sm:gap-5">
        <div className="w-full text-center flex justify-center items-center flex-col gap-5 p-8 md:text-xl text-white font-semibold">
          <h1>Welcome</h1>
          <p>Please Login using your LDAP ID and Password</p>
        </div>
        <div className="w-full">
          <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
