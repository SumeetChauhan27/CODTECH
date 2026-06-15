import React, { useState, useMemo } from 'react';
import DataTable from '../components/DataTable';
import { transactions } from '../data/transactions';
import { Search, Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports'];

  const filteredData = useMemo(() => {
    return transactions.filter(item => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.product.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'transaction_reports.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV Exported Successfully!', { icon: '📊' });
  };

  const totalOrders = filteredData.length;
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalCompleted = filteredData.filter(item => item.status === 'Completed').length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Reports</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Transaction records and data filtering.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ID or Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5 transition-colors appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleExportCSV}
            className="w-full sm:w-auto flex items-center justify-center bg-accent hover:opacity-90 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <DataTable data={filteredData} />

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors">
          Total Orders: <span className="text-accent font-bold">{totalOrders}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors">
          Total Revenue: <span className="text-accent font-bold">₹{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors">
          Completed: <span className="text-emerald-500 font-bold">{totalCompleted}</span>
        </div>
      </div>
    </div>
  );
}
