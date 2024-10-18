import React from "react";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="bg-transparent px-8 pt-3 pb-8 w-full">
      <div className="w-full text-center bg-black mb-5 p-2 rounded-lg text-white max-sm:text-sm">
        <p>
          Any Grievance sent by email will not be attended to / entertained.
          Please lodge your grievance on this portal.
        </p>
      </div>
      <div className="flex justify-center items-center">
        <div className="bg-transparent rounded-lg overflow-hidden w-full max-w-4xl flex max-sm:flex-col-reverse">
          <div className="w-1/2 max-sm:w-full p-8 max-md:p-2">
            <LoginForm></LoginForm>
          </div>
          <div className="w-1/2 max-sm:w-full p-8 max-md:p-2 text-white flex flex-col justify-center">
            <div>
              <div className="flex justify-center mb-1">
                <img
                  src="/icons/login-rm.png"
                  alt="Quiz Icons"
                  className=" w-52 h-52"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">
                Welcome Back
              </h2>
              <p className="text-center">
                Please Login <br /> using your LDAP ID and Password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
