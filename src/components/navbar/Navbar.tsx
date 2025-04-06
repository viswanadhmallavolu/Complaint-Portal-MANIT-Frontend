import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Command } from 'lucide-react';
import { NavLinks } from './NavLinks';
import Logo from './Logo';
import { useToast } from '../../context/ToastContext';

interface NavbarProps {
  auth: {
    role: string;
  } | null;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ auth, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const handleLogout = () => {
    // Show a loading toast that will be updated after logout is complete
    const loadingToastId = toast.info('Signing out...', { autoClose: false });

    // Call the logout function
    logout();

    // After logout is called, update the toast
    setTimeout(() => {
      toast.update(loadingToastId, {
        type: 'success',
        render: 'Successfully signed out!',
        autoClose: 3000,
      });
    }, 500);
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Logo isScrolled={false} />
            </div>

            {/* Desktop Navigation - Only shown when authenticated */}
            {auth?.role && (
              <div className="hidden md:flex items-center space-x-8">
                <div className="text-gray-300">
                  <NavLinks role={auth.role} />
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Mobile menu button - Only shown when authenticated */}
            {auth?.role && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2 rounded-md text-gray-300 hover:text-white"
                >
                  <Menu size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay - Only shown when authenticated and menu is open */}
      {isOpen && auth?.role && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Navigation Sidebar - Only shown when authenticated */}
      {auth?.role && (
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-black z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Logo isScrolled={false} />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-2">
                <NavLinks role={auth.role} />
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-400 hover:text-red-300 rounded-md hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;