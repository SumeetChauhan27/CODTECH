import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, FileText, Settings, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { settings, updateSetting } = useSettings();
  const isCompact = settings.sidebarStyle === 'compact';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarWidth = isCompact ? 'w-20' : 'w-64';
  const sidebarClass = `fixed inset-y-0 left-0 z-50 ${sidebarWidth} bg-gray-900 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`;

  const toggleSidebar = () => {
    updateSetting('sidebarStyle', isCompact ? 'full' : 'compact');
  };

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className={sidebarClass}>
        <div className="flex items-center justify-center h-16 bg-gray-950 border-b border-gray-800 flex-shrink-0">
          {isCompact ? (
            <Activity className="w-8 h-8 text-accent" />
          ) : (
            <span className="text-xl font-bold tracking-wider text-accent flex items-center">
              <Activity className="w-6 h-6 mr-2" /> DataViz
            </span>
          )}
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => 
                `flex items-center ${isCompact ? 'justify-center px-0' : 'px-4'} py-3 rounded-lg transition-colors ${isActive ? 'bg-accent text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
              }
              title={isCompact ? item.name : ""}
            >
              <item.icon className={`w-5 h-5 ${isCompact ? '' : 'mr-3'}`} />
              {!isCompact && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 hidden lg:block">
          <button 
            onClick={toggleSidebar}
            className={`flex items-center w-full py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${isCompact ? 'justify-center' : 'px-4'}`}
            title="Collapse Sidebar"
          >
            {isCompact ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5 mr-3" /> <span>Collapse</span></>}
          </button>
        </div>
      </div>
    </>
  );
}
