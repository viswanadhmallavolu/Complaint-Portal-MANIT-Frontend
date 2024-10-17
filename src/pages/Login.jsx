import React from "react";
import LoginForm from "../components/LoginForm";
const Login = () => {
  return (
    <div className="min-h-[50vw] p-8 w-full flex justify-center items-start">
      <div className="w-full sm:mt-16 grid max-sm:grid-cols-1 grid-cols-2 max-sm:gap-5">
        <div className="w-full text-center flex justify-center items-center flex-col gap-5 p-8 md:text-lg text-white font-semibold">
          <h1 className="text-2xl">Welcome</h1>
          <p>
            Please Login using your <br /> LDAP ID and Password
          </p>
        </div>
        <div className="flex">
          <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
