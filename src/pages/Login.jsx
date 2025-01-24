import React from "react";
import LoginForm from "../components/LoginForm";
import { Building2 } from "lucide-react";

const Login = () => {
  return (
    <div className="relative min-h-screen px-4 py-4 bg-gradient-to-br from-[#1677c8] to-[#0d4c8b] animate-gradient-x overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

      <div className="w-full text-center bg-black/80 backdrop-blur-md mb-8 p-3 rounded-lg text-white max-sm:text-sm shadow-xl border border-white/10 transform hover:scale-[1.01] transition-all">
        <p className="font-medium">
          Any Grievance sent by email will not be attended to / entertained.
          Please lodge your grievance on this portal.
        </p>
      </div>
      
      <div className="container mx-auto flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-md p-10 max-sm:p-6 rounded-3xl w-full max-w-5xl flex flex-row max-md:flex-col gap-16 max-md:gap-8 items-center shadow-2xl border border-white/20 hover:border-white/30 transition-all">
          <div className="w-1/2 max-md:w-full flex flex-col items-center justify-center text-white">
            <div className="relative group">
              <a href="https://manit.ac.in" target="_blank" rel="noreferrer" 
                 className="block transform transition-all duration-300 hover:scale-110 hover:-rotate-2">
                <img
                  src="logo/manit_sm.png"
                  alt="MANIT Logo"
                  className="w-48 h-48 max-md:w-36 max-md:h-36 mb-4 drop-shadow-xl"
                />
                <div className="absolute -inset-2 bg-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/30 w-36 h-10 blur-2xl"></div>
            </div>
            
            <div className="text-center space-y-4 max-md:space-y-3 mt-6">
              <h2 className="text-4xl max-md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-text">
                Your Voice Matters
              </h2>
              <div className="flex items-center justify-center gap-3 text-xl max-md:text-lg font-medium text-blue-100">
                <Building2 className="w-6 h-6 max-md:w-5 max-md:h-5" />
                <p>MANIT Grievance Portal</p>
              </div>
              <p className="text-center text-lg max-md:text-base text-blue-50/90 font-light">
                Please login using your LDAP ID and Password
              </p>
            </div>
          </div>
          
          <div className="w-1/2 max-md:w-full max-md:mt-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;