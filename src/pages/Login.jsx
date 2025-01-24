import React from "react";
import LoginForm from "../components/LoginForm";
import { Building2 } from "lucide-react";

const Login = () => {
  return (
    <div className="bg-gradient-to-br from-[#1677c8] to-[#0d4c8b] min-h-screen px-4 py-4">
      <div className="w-full text-center bg-black/90 backdrop-blur-sm mb-6 p-2.5 rounded-md text-white max-sm:text-sm shadow-lg border border-white/10">
        <p className="font-medium">
          Any Grievance sent by email will not be attended to / entertained.
          Please lodge your grievance on this portal.
        </p>
      </div>
      
      <div className="container mx-auto flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-sm p-8 max-sm:p-4 rounded-2xl w-full max-w-5xl flex flex-row max-md:flex-col gap-12 max-md:gap-6 items-center shadow-xl border border-white/20">
          <div className="w-1/2 max-md:w-full flex flex-col items-center justify-center text-white">
            <div className="relative">
              <a href="https://manit.ac.in" target="_blank" rel="noreferrer" 
                 className="block transition-transform hover:scale-105">
                <img
                  src="logo/manit_sm.png"
                  alt="MANIT Logo"
                  className="w-44 h-44 max-md:w-32 max-md:h-32 mb-4 drop-shadow-lg"
                />
              </a>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/20 w-32 h-8 blur-xl"></div>
            </div>
            
            <div className="text-center space-y-3 max-md:space-y-2">
              <h2 className="text-3xl max-md:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Your Voice Matters
              </h2>
              <div className="flex items-center justify-center gap-2 text-lg max-md:text-base font-medium text-blue-100">
                <Building2 className="w-5 h-5 max-md:w-4 max-md:h-4" />
                <p>MANIT Grievance Portal</p>
              </div>
              <p className="text-center text-lg max-md:text-base text-blue-50/90">
                Please login using your LDAP ID and Password
              </p>
            </div>
          </div>
          
          <div className="w-1/2 max-md:w-full max-md:mt-2">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;