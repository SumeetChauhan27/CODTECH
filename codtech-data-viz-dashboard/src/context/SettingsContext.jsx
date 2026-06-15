import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const SettingsContext = createContext();

export const defaultSettings = {
  theme: 'light',
  accentColor: '#3B82F6', // Blue
  sidebarStyle: 'full', // 'full' or 'compact'
  showStatCards: true,
  showRevenueChart: true,
  showUserGrowthChart: true,
  animateCharts: true,
  currencySymbol: '₹',
  rowsPerPage: 10,
  dateFormat: 'DD MMM YYYY'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('dashboard_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply accent color as CSS variable
    document.documentElement.style.setProperty('--accent', settings.accentColor);
  }, [settings.theme, settings.accentColor]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = () => {
    localStorage.setItem('dashboard_settings', JSON.stringify(settings));
    toast.success('Preferences saved successfully', { icon: '💾' });
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('dashboard_settings');
    toast.success('Reset to defaults', { icon: '🔄' });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, savePreferences, resetToDefaults }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
