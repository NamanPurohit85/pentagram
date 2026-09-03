import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Search, Moon, Sun, Bell } from 'lucide-react';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await api.get('/user/logout');
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-divider px-4 md:px-8 py-3 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
        
        <Link to="/" className="flex items-center gap-3 shrink-0 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent text-white transform group-hover:scale-105 transition-transform">
             <span className="font-serif text-xl font-bold">P</span>
          </div>
          <h2 className="text-xl font-serif font-semibold tracking-tight hidden sm:block text-primary">Pentagram</h2>
        </Link>

        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative flex items-center group">
            <span className="absolute left-4 text-secondary group-focus-within:text-accent transition-colors pointer-events-none flex items-center">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search Pentagram..." 
              className="w-full pl-11 pr-4 py-2.5 border border-divider bg-canvas rounded-full text-sm placeholder:text-secondary text-primary focus:ring-1 focus:ring-accent outline-none transition-all duration-300" 
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-canvas transition-colors text-secondary hover:text-primary cursor-pointer">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="p-2.5 rounded-full hover:bg-canvas transition-colors text-secondary hover:text-primary cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>

          {user && (
            <div className="flex items-center gap-3 ml-2">
              <Link to={`/profile/${user.id}`}>
                <div className="w-10 h-10 rounded-full border border-divider overflow-hidden cursor-pointer bg-canvas flex items-center justify-center text-primary font-bold text-sm hover:scale-105 transition-transform">
                  {user.profilePic ? <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button onClick={handleLogout} className="p-2.5 rounded-full hover:bg-canvas text-secondary hover:text-accent transition-colors cursor-pointer" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;