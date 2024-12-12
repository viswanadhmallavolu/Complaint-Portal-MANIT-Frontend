import { useState, useRef, useEffect } from 'react';

export const useNavbarScroll = (navbarRef: React.RefObject<HTMLDivElement>) => {
  const [isFixed, setIsFixed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    let navbarOffset = navbar.offsetTop;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        if (currentScrollY > navbarOffset && !isFixed) {
          setIsFixed(true);
        }
      } else {
        if (currentScrollY <= navbarOffset && isFixed) {
          setIsFixed(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    const updateOffset = () => {
      navbarOffset = navbar.offsetTop;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateOffset);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateOffset);
    };
  }, [isFixed]);

  return isFixed;
}