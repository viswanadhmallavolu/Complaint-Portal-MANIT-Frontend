import React from "react";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="bg-[#1677c8] px-4 pt-2 pb-4 w-full">
      <div className="w-full text-center bg-black mb-4 p-2 rounded-lg text-white max-sm:text-sm">
        <p>
          Any Grievance sent by email will not be attended to / entertained.
          Please lodge your grievance on this portal.
        </p>
      </div>
      <div className="flex justify-center items-center">
        <div className="bg-transparent rounded-lg overflow-hidden w-full max-w-2xl flex max-sm:flex-col">
          <div className="w-1/2 max-sm:w-full p-4 max-md:p-2 text-white flex flex-col justify-center">
            <div>
              <div className="flex justify-center mb-1">
                <a href="https://manit.ac.in" target="_blank" rel="noreferrer">
                  <img
                    src="logo/manit_sm.png"
                    alt="MANIT Logo"
                    className="w-32 h-32"
                  />
                </a>
              </div>
              <h2 className="text-xl font-bold mb-2 text-center">
                Your Voice Matters.
              </h2>
              <p className="text-center">
                Please Login <br /> using your LDAP ID and Password
              </p>
            </div>
          </div>
          <div className="w-1/2 max-sm:w-full p-4 max-md:p-2">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
