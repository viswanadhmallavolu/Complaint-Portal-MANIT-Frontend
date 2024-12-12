import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="cursor-pointer flex items-center gap-1 hover:opacity-80 transition-opacity"
    >
      <LogOut className="h-5 w-5" />
      <span className="max-s350:hidden">Logout</span>
    </button>
  );
}