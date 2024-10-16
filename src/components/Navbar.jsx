import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Navbar = () => {
  const { auth } = useAuth();
  return (
    <div className="w-[100vw] bg-[#003366] text-white max-sm:text-sm">
      <div className="flex justify-center items-center">
        <div className="max-w-[1200px] w-full flex flex-col gap-2 max-sm:gap-3 justify-start px-8 max-sm:px-2 py-3">
          <div>
            <img
              src="/logo/MANIT-Logo.png"
              alt="MANIT"
              className="max-sm:w-full sm:w-[70%] lg:w-[50%]"
            />
            <span>
              <p className="font-bold">Complaint Management System</p>
            </span>
          </div>
          {auth.role === "student" ? (
            <div className="rounded-lg px-5 py-2 flex gap-5 border-2 border-white">
              <NavLink
                to="/student/home"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/student/profile"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }
              >
                Profile
              </NavLink>
              <NavLink
                to="/student/complaint"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }
              >
                Complaints
              </NavLink>
            </div>
          ) : (
            <div className="rounded-lg px-5 py-2 flex gap-5 border-2 border-white">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/complaints"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }
              >
                Manage Complaints
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
