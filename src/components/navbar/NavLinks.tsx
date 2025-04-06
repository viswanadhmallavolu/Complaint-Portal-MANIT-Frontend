import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, MessageSquare, Search, Phone, MessageCircle, LayoutDashboard, Settings } from 'lucide-react';

const WARDEN_ROLES = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12"];

interface NavLinksProps {
  role: string;
}

export const NavLinks: React.FC<NavLinksProps> = ({ role }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-500/20 text-indigo-400'
        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
    }`;

  const getNavConfig = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/student/home', icon: <Home size={20} />, label: 'Home' },
          { to: '/student/profile', icon: <User size={20} />, label: 'Profile' },
          { to: '/student/complaint', icon: <MessageSquare size={20} />, label: 'Raise Ticket' },
          { to: '/student/search', icon: <Search size={20} />, label: 'Search' },
          { to: '/student/contacts', icon: <Phone size={20} />, label: 'Contacts' },
          { to: '/student/feedback', icon: <MessageCircle size={20} />, label: 'Feedback' }
        ];
      case 'electric_admin':
      case 'internet_admin':
      case 'medical_admin':
        return [
          { to: `/${role}/complaints`, icon: <MessageSquare size={20} />, label: 'Complaints' },
          { to: `/${role}/search`, icon: <Search size={20} />, label: 'Search' }
        ];
      case 'cow':
        return [
          { to: `/${role}/dashboard`, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
          { to: `/${role}/complaints`, icon: <MessageSquare size={20} />, label: 'Complaints' },
          { to: `/${role}/search`, icon: <Search size={20} />, label: 'Search' }
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
          { to: '/admin/complaints', icon: <MessageSquare size={20} />, label: 'Complaints' },
          { to: '/admin/utils', icon: <Settings size={20} />, label: 'Utils' }
        ];
      default:
        if (WARDEN_ROLES.includes(role)) {
          return [
            { to: `/${role}/complaints`, icon: <MessageSquare size={20} />, label: 'Complaints' },
            { to: `/${role}/warden/dashboard`, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { to: `/${role}/search`, icon: <Search size={20} />, label: 'Search' }
          ];
        }
        return [];
    }
  };

  const navItems = getNavConfig();

  return (
    <div className="flex md:flex-row flex-col md:items-center md:space-x-1 space-y-1 md:space-y-0">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} className={linkClass}>
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;