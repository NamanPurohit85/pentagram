import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('color-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1e1e1e] border-b border-[#e5e2e1] dark:border-gray-800 px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-[#4441c4] rounded-xl flex items-center justify-center text-white shadow-sm">
            {/* Pentagram Logo SVG */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 9.5L5.8 21H18.2L22 9.5L12 2Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight hidden sm:block dark:text-white">Pentagram</h2>
        </div>

        {/* Search Section */}
        <div className="flex-1 max-w-lg">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[#777585] dark:text-gray-400 pointer-events-none flex items-center">
              {/* Search Icon SVG */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search Pentagram" 
              className="w-full pl-10 pr-4 py-2 border-none bg-[#f0edec] dark:bg-[#121212] rounded-full text-sm placeholder-[#464554] dark:placeholder-gray-500 text-[#1c1b1b] dark:text-white focus:ring-2 focus:ring-[#4441c4] focus:bg-white dark:focus:bg-[#2a2a2a] transition-all outline-none" 
            />
          </div>
        </div>

        {/* Profile/Actions Section */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[#f6f3f2] dark:hover:bg-gray-800 transition-colors text-[#464554] dark:text-gray-400 cursor-pointer flex items-center justify-center"
            title="Toggle Theme"
          >
            {isDarkMode ? (
              /* Sun / Light Mode Icon */
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              /* Moon / Dark Mode Icon */
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          
          {/* Notifications Button */}
          <button className="p-2 rounded-full hover:bg-[#f6f3f2] dark:hover:bg-gray-800 transition-colors text-[#464554] dark:text-gray-400 cursor-pointer flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full border border-[#e5e2e1] dark:border-gray-700 overflow-hidden cursor-pointer bg-[#4441c4] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            HS
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;