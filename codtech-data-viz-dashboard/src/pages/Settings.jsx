import React from 'react';
import { useSettings } from '../context/SettingsContext';

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    <button
      type="button"
      className={`${
        checked ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

export default function Settings() {
  const { settings, updateSetting, savePreferences, resetToDefaults } = useSettings();

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Manage your dashboard preferences and appearance.</p>
      </div>

      <Section title="Appearance">
        <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700/50">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
          <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => updateSetting('theme', 'light')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${settings.theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => updateSetting('theme', 'dark')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${settings.theme === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700/50">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Accent Colour</span>
          <div className="flex space-x-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => updateSetting('accentColor', c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-8 h-8 rounded-full focus:outline-none transition-transform ${settings.accentColor === c.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110' : 'hover:scale-110'}`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sidebar Style</span>
          <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => updateSetting('sidebarStyle', 'full')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${settings.sidebarStyle === 'full' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              Full
            </button>
            <button
              onClick={() => updateSetting('sidebarStyle', 'compact')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${settings.sidebarStyle === 'compact' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              Compact
            </button>
          </div>
        </div>
      </Section>

      <Section title="Dashboard Preferences">
        <ToggleSwitch 
          label="Show Stat Cards" 
          checked={settings.showStatCards} 
          onChange={(v) => updateSetting('showStatCards', v)} 
        />
        <ToggleSwitch 
          label="Show Revenue Chart" 
          checked={settings.showRevenueChart} 
          onChange={(v) => updateSetting('showRevenueChart', v)} 
        />
        <ToggleSwitch 
          label="Show User Growth Chart" 
          checked={settings.showUserGrowthChart} 
          onChange={(v) => updateSetting('showUserGrowthChart', v)} 
        />
        <ToggleSwitch 
          label="Animate Charts" 
          checked={settings.animateCharts} 
          onChange={(v) => updateSetting('animateCharts', v)} 
        />
      </Section>

      <Section title="Data & Display">
        <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700/50">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency Symbol</span>
          <select 
            value={settings.currencySymbol}
            onChange={(e) => updateSetting('currencySymbol', e.target.value)}
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-32 p-2.5 transition-colors"
          >
            <option value="₹">₹ INR</option>
            <option value="$">$ USD</option>
            <option value="€">€ EUR</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700/50">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rows Per Page</span>
          <select 
            value={settings.rowsPerPage}
            onChange={(e) => updateSetting('rowsPerPage', Number(e.target.value))}
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-32 p-2.5 transition-colors"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</span>
          <select 
            value={settings.dateFormat}
            onChange={(e) => updateSetting('dateFormat', e.target.value)}
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-40 p-2.5 transition-colors"
          >
            <option value="DD MMM YYYY">DD MM YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </Section>

      <div className="flex items-center justify-end space-x-4 pt-4">
        <button 
          onClick={resetToDefaults}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
        >
          Reset to Defaults
        </button>
        <button 
          onClick={savePreferences}
          className="px-6 py-2.5 bg-accent hover:opacity-90 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-gray-900 active:scale-95"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
