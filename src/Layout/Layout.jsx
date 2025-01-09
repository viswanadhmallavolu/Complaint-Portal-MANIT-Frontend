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
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
