import React from 'react';

export const Logo = () => {
  return (
    <div className="w-full bg-[#003366] text-white">
      <div className="max-w-[1200px] mx-auto px-8 max-sm:px-2 pt-3">
        <a href="https://www.manit.ac.in/" target="_blank" rel="noopener noreferrer">
          <img
            src="/logo/MANIT-Logo.png"
            alt="MANIT"
            width={300}
            height={100}
            loading="lazy"
            className="max-sm:w-full sm:w-[70%] lg:w-[50%]"
          />
        </a>
      </div>
    </div>
  );
}