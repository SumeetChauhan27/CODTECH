import React from 'react';

export default function ChartWrapper({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[400px] transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
      <div className="flex-1 w-full h-full min-h-0">
        {children}
      </div>
    </div>
  );
}
