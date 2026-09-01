import React from 'react';

const Sidebar = () => {
  return (
    <nav className="hidden lg:flex lg:col-span-3 flex-col gap-2">
      {/* Home Link (Active) */}
      <a className="flex items-center gap-4 p-3 rounded-lg bg-[#e2dfff] dark:bg-[#4441c4]/20 text-[#4441c4] dark:text-[#c2c1ff] font-bold transition-colors" href="#">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span>Home</span>
      </a>

      {/* Explore Link */}
      <a className="flex items-center gap-4 p-3 rounded-lg hover:bg-white dark:hover:bg-[#1e1e1e] transition-colors text-[#1c1b1b] dark:text-gray-300" href="#">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
        <span>Explore</span>
      </a>

      {/* Messages Link */}
      <a className="flex items-center gap-4 p-3 rounded-lg hover:bg-white dark:hover:bg-[#1e1e1e] transition-colors text-[#1c1b1b] dark:text-gray-300" href="#">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <span>Messages</span>
      </a>

      {/* Bookmarks Link */}
      <a className="flex items-center gap-4 p-3 rounded-lg hover:bg-white dark:hover:bg-[#1e1e1e] transition-colors text-[#1c1b1b] dark:text-gray-300" href="#">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Bookmarks</span>
      </a>

      {/* Profile Link */}
      <a className="flex items-center gap-4 p-3 rounded-lg hover:bg-white dark:hover:bg-[#1e1e1e] transition-colors text-[#1c1b1b] dark:text-gray-300" href="#">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </a>
    </nav>
  );
};

export default Sidebar;