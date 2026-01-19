'use client';

import { useEffect, useState, useCallback } from 'react';

export function ScrollDownIndicator() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkInitialPosition = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition <= 10);
    };

    checkInitialPosition();

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition <= 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <button
      type="button"
      className={`fixed left-1/2 transform -translate-x-1/2 transition-opacity duration-300 cursor-pointer z-50 bg-transparent border-none p-2 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ bottom: '20px' }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Scroll down to next section"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <div className="flex flex-col items-center gap-2 animate-bounce">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-text-primary"
          aria-hidden="true"
        >
          <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
}
