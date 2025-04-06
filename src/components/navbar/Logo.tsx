import React from 'react';

interface LogoProps {
  isScrolled?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled = false }) => {
  return (
    <div className="flex items-center">
      <img
        src="/logo/manit_sm.png"
        alt="MANIT"
        className="h-12 w-auto"
      />
      <div className="ml-3 text-base font-semibold shine-effect">
        MANIT-Grievance Portal
      </div>
    </div>
  );
};

export default Logo;