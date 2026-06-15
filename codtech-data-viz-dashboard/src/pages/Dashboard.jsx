import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import ChartWrapper from '../components/ChartWrapper';
import { statCards, revenueData, userGrowthData, trafficSources, aiInsights, recentTransactions } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, Download } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { settings } = useSettings();
  const [revenueYear, setRevenueYear] = useState('2024');
  const [showNewUsers, setShowNewUsers] = useState(true);
  const [showReturningUsers, setShowReturningUsers] = useState(true);

  const handleDownload = () => {
    toast.success('Chart downloaded as PNG!', { icon: '🖼️' });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* KPI Cards */}
      {settings?.showStatCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      )}

      {/* Main Charts Row */}
      <div className={`grid grid-cols-1 ${settings?.showRevenueChart && settings?.showUserGrowthChart ? 'lg:grid-cols-2' : ''} gap-6`}>
        {settings?.showRevenueChart && (
          <ChartWrapper 
            title="Monthly Revenue"
            action={
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 flex">
                  <button onClick={() => setRevenueYear('2024')} className={`px-2 py-1 text-xs font-medium rounded transition-colors ${revenueYear === '2024' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>2024</button>
                  <button onClick={() => setRevenueYear('2023')} className={`px-2 py-1 text-xs font-medium rounded transition-colors ${revenueYear === '2023' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>2023</button>
                </div>
                <button onClick={handleDownload} className="p-1.5 text-gray-400 hover:text-accent transition-colors" title="Download PNG">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280' }} 
                  dx={-10} 
                  tickFormatter={(val) => `${settings?.currencySymbol || '₹'}${val/1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [`${settings?.currencySymbol || '₹'}${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)' }}
                  cursor={{ fill: 'rgba(243, 244, 246, 0.4)' }}
                />
                <Bar 
                  dataKey={revenueYear === '2024' ? 'revenue2024' : 'revenue2023'} 
                  name={`Revenue ${revenueYear}`} 
                  fill={settings?.accentColor || '#3B82F6'} 
                  radius={[4, 4, 0, 0]} 
                  barSize={24} 
                  isAnimationActive={settings?.animateCharts}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        )}

        {settings?.showUserGrowthChart && (
          <ChartWrapper 
            title="User Growth Trend"
            action={
              <div className="flex items-center space-x-3 text-xs">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input type="checkbox" checked={showNewUsers} onChange={(e) => setShowNewUsers(e.target.checked)} className="rounded text-accent focus:ring-accent" />
                  <span className="text-gray-600 dark:text-gray-300">New</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input type="checkbox" checked={showReturningUsers} onChange={(e) => setShowReturningUsers(e.target.checked)} className="rounded text-accent focus:ring-accent" />
                  <span className="text-gray-600 dark:text-gray-300">Returning</span>
                </label>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)' }} />
                {showNewUsers && (
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    name="New Users" 
                    stroke={settings?.accentColor || '#3B82F6'} 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                    isAnimationActive={settings?.animateCharts}
                  />
                )}
                {showReturningUsers && (
                  <Line 
                    type="monotone" 
                    dataKey="returningUsers" 
                    name="Returning Users" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                    isAnimationActive={settings?.animateCharts}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        )}
      </div>

      {/* Third Row: Pie Chart, AI Insights, Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartWrapper title="Traffic Sources">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={trafficSources} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="45%" 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={5}
                    isAnimationActive={settings?.animateCharts}
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
             </ResponsiveContainer>
          </ChartWrapper>
        </div>

        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200 flex flex-col">
           <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-accent mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI Insights</h3>
           </div>
           <div className="space-y-4 flex-1 overflow-auto pr-2">
             {aiInsights.map(insight => (
                <div key={insight.id} className={`p-3 rounded-lg border ${insight.type === 'warning' ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/50 text-amber-800 dark:text-amber-200' : 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/50 text-indigo-800 dark:text-indigo-200'}`}>
                  <p className="text-sm font-medium">{insight.text}</p>
                </div>
             ))}
           </div>
        </div>

        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200 flex flex-col">
           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Transactions</h3>
           <div className="space-y-4 flex-1 overflow-auto pr-2">
             {recentTransactions.map(tx => (
               <div key={tx.id} className="flex items-center justify-between border-b border-gray-50 dark:border-gray-700/50 pb-3 last:border-0 last:pb-0">
                 <div>
                   <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{tx.name}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{tx.amount}</p>
                   <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${tx.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                     {tx.status}
                   </span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
