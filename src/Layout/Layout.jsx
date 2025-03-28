import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  const { pathname } = useLocation();

  const scrollUp = () => {
    window.scrollTo(0, 0);
  };

  useEffect(scrollUp, [pathname]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
