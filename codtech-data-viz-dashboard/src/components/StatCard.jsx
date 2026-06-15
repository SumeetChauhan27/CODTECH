import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function StatCard({ title, value, change, positive, sparklineData }) {
  // Determine color based on positive/negative
  const color = positive ? '#10B981' : '#EF4444'; // Tailwind green-500 or red-500

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${positive ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-auto">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        
        {/* Sparkline Graph */}
        {sparklineData && (
          <div className="w-24 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`colorSparkline-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="pv" 
                  stroke={color} 
                  strokeWidth={2} 
                  fill={`url(#colorSparkline-${title.replace(/\s+/g, '')})`} 
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
