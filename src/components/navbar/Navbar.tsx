import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import {  NavLinks }  from './NavLinks';
import { LogoutButton } from './LogoutButton';
import { useNavbarScroll } from '../useNavbarScroll';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navbarRef = useRef<HTMLDivElement>(null);
  const isFixed = useNavbarScroll(navbarRef);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <Logo />
      <div
        ref={navbarRef}
        className={`w-full bg-[#003366] text-white ${isFixed ? 'fixed top-0 left-0 right-0 z-50' : ''
          }`}
      >
        <div className="bg-[#003366]">
          <div className="max-w-[1200px] mx-auto px-8 max-sm:px-2 flex flex-col">
            <span className="py-2">
              <p className="font-bold">Complaint Management Portal</p>
            </span>
            {auth?.role && (
              <div className="mb-3 rounded-lg px-5 max-sm:px-2 py-2 flex justify-between items-center border-2 border-white">
                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center justify-between w-full">
                  <NavLinks role={auth.role} />
                  <LogoutButton onLogout={logout} />
                </div>

                {/* Mobile Trigger */}
                <div className="sm:hidden flex items-center justify-between w-full">
                  <button onClick={toggleMenu} className="text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <LogoutButton onLogout={logout} />
                </div>

                {/* Slide-Out Menu */}
                <div
                  className={`sm:hidden fixed top-0 left-0 h-full w-64 bg-[#003366]
                  transform transition-transform duration-300 z-50
                  ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                  <div className="p-4 flex flex-col gap-4">
                    <button onClick={toggleMenu} className="self-end text-white">
                      {/* Cross icon */}
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <NavLinks role={auth.role} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isFixed && (
        <div
          className="bg-gray-50"
          style={{ height: auth === null ? '50px' : '100px' }}
        />
      )}
    </div>
  );
}

export default Navbar;