import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, Sun, Moon, Search, Calendar, CheckCircle, Info, AlertCircle, Settings, LogOut, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Header({ setMobileOpen }) {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order received', time: '5m ago', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
    { id: 2, title: 'Revenue target achieved', time: '1h ago', icon: <Info className="w-4 h-4 text-blue-500" /> },
    { id: 3, title: 'Server status normal', time: '2h ago', icon: <CheckCircle className="w-4 h-4 text-indigo-500" /> },
  ]);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    toast.success(isDark ? 'Light mode enabled!' : 'Dark mode enabled!', {
      icon: isDark ? '🌞' : '🌙'
    });
  };

  const handleDateChange = (e) => {
    toast(`Date range updated to ${e.target.value}`, { icon: '📅' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const handleSearchResultClick = (result) => {
    toast.success(`Navigating to ${result}`, { icon: '🚀' });
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const markAllRead = () => {
    setNotifications([]);
    toast.success('All notifications marked as read', { icon: '🧹' });
  };

  const handleProfileOptionClick = (option) => {
    toast.success(`${option} clicked!`, { icon: '✨' });
    setShowProfile(false);
  };

  const searchResults = ['Q1 Financial Report', 'User Growth Analytics', 'Monthly Expenses Summary', 'Traffic Sources Data']
    .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 h-16 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0 transition-colors duration-200">
      <div className="flex items-center flex-1">
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 mr-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden sm:block transition-colors duration-200 mr-8 tracking-tight">Analytics Pro</h2>
        
        {/* Search Bar */}
        <form 
          ref={searchRef} 
          className="hidden md:block relative"
          onSubmit={(e) => {
            e.preventDefault();
            if(searchQuery) {
              toast.success(`Searching for: ${searchQuery}`, { icon: '🔍' });
              setShowSearchResults(false);
              setSearchQuery('');
            }
          }}
        >
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 transition-colors duration-200 w-64 border border-transparent focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <button type="submit" className="focus:outline-none group">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 mr-2 cursor-pointer transition-colors" />
            </button>
            <input 
              type="text" 
              placeholder="Search Reports..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => { if(searchQuery) setShowSearchResults(true); }}
              className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 w-full placeholder-gray-400"
            />
          </div>
          
          {/* Search Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <ul className="py-1">
                  {searchResults.map((result, idx) => (
                    <li 
                      key={idx} 
                      onClick={() => handleSearchResultClick(result)}
                      className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer flex items-center transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 inline mr-3 text-gray-400" />
                      {result}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">No results found</div>
              )}
            </div>
          )}
        </form>
      </div>
      
      <div className="flex items-center space-x-1 sm:space-x-3">
        {/* Date Range Filter */}
        <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:border-gray-300 dark:hover:border-gray-600">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <select 
            onChange={handleDateChange}
            className="bg-transparent border-none outline-none text-sm font-medium text-gray-600 dark:text-gray-300 appearance-none cursor-pointer pr-4 focus:ring-0"
            defaultValue="Last 30 Days"
          >
            <option className="dark:bg-gray-800">Last 7 Days</option>
            <option className="dark:bg-gray-800">Last 30 Days</option>
            <option className="dark:bg-gray-800">Last 90 Days</option>
            <option className="dark:bg-gray-800">Custom Date</option>
          </select>
        </div>

        <button 
          onClick={toggleDarkMode}
          className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Notifications ({notifications.length})</h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    You're all caught up!
                  </li>
                ) : (
                  notifications.map((notif) => (
                    <li key={notif.id} className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer flex items-start group">
                      <div className="mt-0.5 mr-3 flex-shrink-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">{notif.icon}</div>
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{notif.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        
        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative ml-2">
          <button 
            onClick={() => setShowProfile(!showProfile)} 
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all hover:scale-105">
              <span className="text-sm font-bold">S</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Sumeet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@dashboard.com</p>
              </div>
              <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li onClick={() => handleProfileOptionClick('Profile')} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer flex items-center transition-colors">
                  <User className="w-4 h-4 mr-2 text-gray-400" /> My Profile
                </li>
                <li onClick={() => handleProfileOptionClick('Settings')} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer flex items-center transition-colors">
                  <Settings className="w-4 h-4 mr-2 text-gray-400" /> Settings
                </li>
                <div className="border-t border-gray-50 dark:border-gray-700/50 my-1"></div>
                <li onClick={() => handleProfileOptionClick('Sign Out')} className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer flex items-center transition-colors">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
