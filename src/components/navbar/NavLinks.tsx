import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../types/roles/UserRole';

interface NavLinksProps {
  role: UserRole;
}

export const NavLinks: React.FC<NavLinksProps> = ({ role }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? 'border-b-2 border-white' : 'border-b-2 border-transparent'}`;

  if (role === 'student') {
    return (
      <div className="flex gap-5 max-sm:gap-2">
        <NavLink to="/student/home" className={linkClass}>Home</NavLink>
        <NavLink to="/student/profile" className={linkClass}>Profile</NavLink>
        <NavLink to="/student/complaint" className={linkClass}>Complain</NavLink>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div className="flex gap-5 max-sm:gap-2">
        <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/admin/complaints" className={linkClass}>Complaints</NavLink>
        <NavLink to="/admin/utils" className={linkClass}>Utils</NavLink>
      </div>
    );
  }

  return null;
}