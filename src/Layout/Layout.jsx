import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
const Layout = () => {
  const { pathname } = useLocation();

  const scrollUp = () => {
    const scrollableElement = document.querySelector("body > div");
    if (scrollableElement) {
      scrollableElement.scrollTop = 0;
    }
  };

  useEffect(scrollUp, [pathname]);
  return (
    <div>
      <Navbar/>
      <Outlet />
    </div>
  );
};

export default Layout;
