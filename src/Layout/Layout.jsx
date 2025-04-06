import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { pathname } = useLocation();
  const { auth, logout } = useAuth();

  const scrollUp = () => {
    window.scrollTo(0, 0);
  };

  useEffect(scrollUp, [pathname]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar auth={auth} logout={logout} />
      <div className="flex-grow pt-16"> {/* Added pt-16 to create space for the navbar */}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
