import React, { useState, useMemo } from 'react';
import ChartWrapper from '../components/ChartWrapper';
import { categoryData, weeklyOrdersData, topProducts, deviceData } from '../data/mockData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList, Legend as RechartsLegend } from 'recharts';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { useSettings } from '../context/SettingsContext';
import { Download, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Analytics() {
  const { settings } = useSettings();
  
  // Toggles State
  const [pieMode, setPieMode] = useState('donut'); // 'pie' or 'donut'
  const [areaMode, setAreaMode] = useState('overlap'); // 'stacked' or 'overlap'
  const [barSort, setBarSort] = useState('desc'); // 'desc' (High to Low) or 'asc' (Low to High)
  const [deviceMode, setDeviceMode] = useState('grouped'); // 'grouped' or 'stacked'
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const handleExport = () => {
    toast.success('Analytics Exported to PDF!', { icon: '📄' });
  };

  // Nivo Pie Data
  const nivoPieData = categoryData.map(item => ({
    id: item.name,
    label: item.name,
    value: item.value,
    color: item.color
  }));

  // Sorted Top Products
  const sortedProducts = useMemo(() => {
    const sorted = [...topProducts];
    sorted.sort((a, b) => barSort === 'desc' ? b.revenue - a.revenue : a.revenue - b.revenue);
    return sorted;
  }, [barSort]);

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Deep dive into your business metrics.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                toast(`Date range changed to ${e.target.value}`, { icon: '📅' });
              }}
              className="pl-9 pr-8 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-accent focus:border-accent appearance-none transition-colors"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last Year">Last Year</option>
            </select>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center justify-center bg-accent hover:opacity-90 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Chart 1: Sales by Category */}
        <ChartWrapper 
          title="Sales by Category"
          action={
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 flex">
              <button onClick={() => setPieMode('pie')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${pieMode === 'pie' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Pie</button>
              <button onClick={() => setPieMode('donut')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${pieMode === 'donut' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Donut</button>
            </div>
          }
        >
          <div className="w-full h-full pb-4">
            <ResponsivePie
              data={nivoPieData}
              margin={{ top: 20, right: 100, bottom: 20, left: 20 }}
              innerRadius={pieMode === 'donut' ? 0.6 : 0}
              padAngle={pieMode === 'donut' ? 2 : 0}
              cornerRadius={pieMode === 'donut' ? 4 : 0}
              colors={{ datum: 'data.color' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableArcLinkLabels={false}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#fff"
              animate={settings?.animateCharts ?? true}
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  justify: false,
                  translateX: 80,
                  translateY: 0,
                  itemsSpacing: 10,
                  itemWidth: 80,
                  itemHeight: 18,
                  itemTextColor: '#6B7280',
                  symbolSize: 14,
                  symbolShape: 'circle',
                }
              ]}
              theme={{
                tooltip: { container: { background: '#fff', color: '#333', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' } }
              }}
            />
          </div>
        </ChartWrapper>

        {/* Chart 2: Weekly Orders (Area Chart) */}
        <ChartWrapper 
          title="Weekly Orders"
          action={
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 flex">
              <button onClick={() => setAreaMode('stacked')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${areaMode === 'stacked' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Stacked</button>
              <button onClick={() => setAreaMode('overlap')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${areaMode === 'overlap' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Overlap</button>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyOrdersData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={settings?.accentColor || '#3B82F6'} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={settings?.accentColor || '#3B82F6'} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.95)' }} />
              <RechartsLegend iconType="circle" wrapperStyle={{ paddingTop: '15px' }} />
              <Area type="monotone" dataKey="completed" name="Completed" stackId={areaMode === 'stacked' ? '1' : undefined} stroke={settings?.accentColor || '#3B82F6'} strokeWidth={2} fill="url(#colorCompleted)" isAnimationActive={settings?.animateCharts} />
              <Area type="monotone" dataKey="cancelled" name="Cancelled" stackId={areaMode === 'stacked' ? '1' : undefined} stroke="#EF4444" strokeWidth={2} fill="url(#colorCancelled)" isAnimationActive={settings?.animateCharts} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Chart 3: Top 5 Products (Horizontal Bar) */}
        <ChartWrapper 
          title="Top 5 Products by Revenue"
          action={
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 flex">
              <button onClick={() => setBarSort('desc')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${barSort === 'desc' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>High → Low</button>
              <button onClick={() => setBarSort('asc')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${barSort === 'asc' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Low → High</button>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={sortedProducts} margin={{ top: 20, right: 50, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="product" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} width={80} />
              <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.95)' }} />
              <Bar dataKey="revenue" fill={settings?.accentColor || '#3B82F6'} radius={[0, 4, 4, 0]} barSize={28} isAnimationActive={settings?.animateCharts}>
                <LabelList dataKey="revenue" position="right" formatter={(val) => `${settings?.currencySymbol || '₹'}${(val/1000)}k`} fill="#6B7280" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Chart 4: Sessions by Device (Nivo Bar) */}
        <ChartWrapper 
          title="Sessions by Device — Monthly"
          action={
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 flex">
              <button onClick={() => setDeviceMode('grouped')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${deviceMode === 'grouped' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Grouped</button>
              <button onClick={() => setDeviceMode('stacked')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${deviceMode === 'stacked' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Stacked</button>
            </div>
          }
        >
          <div className="w-full h-full">
            <ResponsiveBar
              data={deviceData}
              keys={['Desktop', 'Mobile', 'Tablet']}
              indexBy="month"
              margin={{ top: 20, right: 120, bottom: 40, left: 40 }}
              padding={0.3}
              groupMode={deviceMode}
              colors={['#8B5CF6', '#10B981', '#F59E0B']}
              borderRadius={2}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                tickValues: 4,
              }}
              enableLabel={false}
              theme={{
                axis: { ticks: { text: { fill: '#6B7280' } } },
                grid: { line: { stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '3 3' } },
                tooltip: { container: { background: '#fff', color: '#333', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' } }
              }}
              animate={settings?.animateCharts ?? true}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 14,
                  symbolShape: 'circle',
                }
              ]}
            />
          </div>
        </ChartWrapper>

      </div>
    </div>
  );
}
