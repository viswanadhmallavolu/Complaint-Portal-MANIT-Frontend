import React, { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import {  NavLinks }  from './NavLinks';
import { LogoutButton } from './LogoutButton';
import { useNavbarScroll } from '../useNavbarScroll';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navbarRef = useRef<HTMLDivElement>(null);
  const isFixed = useNavbarScroll(navbarRef);

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
              <div className="mb-3 rounded-lg px-5 max-sm:px-2 py-2 flex justify-between border-2 border-white">
                <NavLinks role={auth.role} />
                <LogoutButton onLogout={logout} />
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