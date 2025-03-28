import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../types/roles/UserRole';

// Define the list of warden roles.
const WARDEN_ROLES = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12"];

interface NavLinksProps {
  role: UserRole;
}

export const NavLinks: React.FC<NavLinksProps> = ({ role }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? 'border-b-2 border-white' : 'border-b-2 border-transparent'} block py-2`;

  if (role === 'student') {
    return (
      <div className="flex sm:flex-row flex-col sm:gap-5 gap-2">
        <NavLink to="/student/home" className={linkClass}>Home</NavLink>
        <NavLink to="/student/profile" className={linkClass}>Profile</NavLink>
        <NavLink to="/student/complaint" className={linkClass}>Complain</NavLink>
        <NavLink to="/student/search" className={linkClass} title='Search a Complaint Quickly'>Search</NavLink>
        <NavLink to="/student/contacts" className={linkClass} title='Contacts of Authority'>Contacts</NavLink>
        <NavLink to="/student/feedback" className={linkClass} title='Submit Feedback'>Feedback</NavLink>
      </div>
    );
  }

  if (role === 'electric_admin' || role === 'internet_admin' || role === 'medical_admin') {
    return (
      <div className="flex sm:flex-row flex-col sm:gap-5 gap-2">
        <NavLink to={`/${role}/complaints`} className={linkClass}>Complaints</NavLink>
        <NavLink to={`/${role}/search`} className={linkClass}>Search</NavLink>
      </div>
    );
  }
  if (role === 'cow') {
    return (
      <div className="flex sm:flex-row flex-col sm:gap-5 gap-2">
        <NavLink to={`/${role}/dashboard`} className={linkClass}>Dashboard</NavLink>
        <NavLink to={`/${role}/complaints`} className={linkClass}>Complaints</NavLink>
        <NavLink to={`/${role}/search`} className={linkClass}>Search</NavLink>
      </div>
    );

  }

  // Check if the role is one of the warden roles.
  if (role && WARDEN_ROLES.includes(role)) {
    return (
      <div className="flex sm:flex-row flex-col sm:gap-5 gap-2">
        <NavLink to={`/${role}/complaints`} className={linkClass}>Complaints</NavLink>
        <NavLink to={`/${role}/warden/dashboard`} className={linkClass}>Dashboard</NavLink>
        <NavLink to={`/${role}/search`} className={linkClass}>Search</NavLink>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div className="flex sm:flex-row flex-col sm:gap-5 gap-2">
        <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/admin/complaints" className={linkClass}>Complaints</NavLink>
        <NavLink to="/admin/utils" className={linkClass}>Utils</NavLink>
      </div>
    );
  }

  return null;
};