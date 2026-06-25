import { FiGrid, FiList } from "react-icons/fi";

export default function SortBar({
  filteredCount,
  initialSearch,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode
}) {
  return (
    <>
      <div className="hidden md:flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <span className="text-sm font-medium text-gray-500">
          Showing <span className="text-gray-900">{filteredCount}</span> product{filteredCount !== 1 ? 's' : ''}
          {initialSearch && ` for "${initialSearch}"`}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-gray-300 bg-gray-50 rounded-md focus:ring-orange-500 focus:border-orange-500 py-1.5 px-3 font-medium text-gray-700"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
          
          <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 p-1">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <FiGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-all ${viewMode === "list" ? "bg-white shadow-sm text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <FiList size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="md:hidden flex justify-end mb-6">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-300 bg-white rounded-lg focus:ring-orange-500 focus:border-orange-500 py-2.5 px-3 w-full font-medium"
        >
          <option value="popularity">Sort by Popularity</option>
          <option value="price-low">Sort by Price: Low to High</option>
          <option value="price-high">Sort by Price: High to Low</option>
          <option value="newest">Sort by Newest First</option>
        </select>
      </div>
    </>
  );
}