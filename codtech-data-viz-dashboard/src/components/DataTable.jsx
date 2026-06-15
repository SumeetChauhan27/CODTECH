import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

export default function DataTable({ data = [] }) {
  const { settings } = useSettings();
  const rowsPerPage = settings?.rowsPerPage || 10;
  
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = (id) => toast(`Editing order ${id}`, { icon: '✏️' });
  const handleDelete = (id) => toast.success(`Deleted order ${id}`, { icon: '🗑️' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return sortedData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, sortedData, rowsPerPage]);

  // Ensure current page is valid when data shrinks (e.g. searching)
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ChevronUp className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-accent" /> : <ChevronDown className="w-3 h-3 ml-1 text-accent" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Cancelled': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">#</th>
              <th scope="col" className="px-6 py-4">Order ID</th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('product')}>
                <div className="flex items-center">Product {renderSortIcon('product')}</div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('category')}>
                <div className="flex items-center">Category {renderSortIcon('category')}</div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('amount')}>
                <div className="flex items-center">Amount {renderSortIcon('amount')}</div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center">Date {renderSortIcon('date')}</div>
              </th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">📄</span>
                    <p>No records found matching your filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentTableData.map((row, idx) => (
                <tr key={row.id} className="bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4 text-gray-400">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{row.id}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.product}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{row.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{settings?.currencySymbol || '₹'}{row.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(row.id)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-md transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 transition-colors">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-gray-100">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(currentPage * rowsPerPage, sortedData.length)}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{sortedData.length}</span>
        </span>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              // Simple pagination logic to show limited buttons
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum 
                    ? 'bg-accent text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
