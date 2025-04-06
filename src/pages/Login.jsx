import React from "react";
import LoginForm from "../components/LoginForm";
import { Building2 } from "lucide-react";

const Login = () => {
  return (
    <div className="relative min-h-screen px-4 py-8 bg-gradient-to-br from-[#1677c8] to-[#0d4c8b] animate-gradient-x overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

      <div className="w-full max-w-3xl mx-auto text-center bg-black/80 backdrop-blur-md mb-4 sm:mb-8 p-2 sm:p-3 rounded-lg text-white text-xs sm:text-sm shadow-xl border border-white/10 transform hover:scale-[1.01] transition-all">
        <p className="font-medium">
          Any Grievance sent by email will not be attended to / entertained.
          Please lodge your grievance on this portal.
        </p>
      </div>

      <div className="mx-auto flex max-w-5xl">
        <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 md:p-10 rounded-3xl w-full flex flex-col md:flex-row gap-6 md:gap-12 items-center shadow-2xl border border-white/20 hover:border-white/30 transition-all">
          {/* Logo and text section */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-white">
            <div className="relative group">
              <a href="https://manit.ac.in" target="_blank" rel="noreferrer"
                className="block transform transition-all duration-300 hover:scale-110 hover:-rotate-2">
                <img
                  src="logo/manit_sm.png"
                  alt="MANIT Logo"
                  className="w-28 h-28 sm:w-40 sm:h-40 mb-4 drop-shadow-xl"
                />
                <div className="absolute -inset-2 bg-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>

            <div className="text-center space-y-3 mt-2 sm:mt-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-text">
                Your Voice Matters
              </h2>
              <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-medium text-blue-100">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <p>MANIT Grievance Portal</p>
              </div>
            </div>
          </div>

          {/* Login form section */}
          <div className="w-full md:w-2/3">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;