import { FiX } from "react-icons/fi";

export default function FilterSidebar({
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  clearFilters
}) {
  return (
    <div className={`
      fixed inset-0 z-50 bg-white p-6 overflow-y-auto transition-transform transform md:relative md:transform-none md:w-1/4 md:p-0 md:bg-transparent md:z-auto md:block
      ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="text-xl font-bold">Filters</h2>
        <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full">
          <FiX size={20} />
        </button>
      </div>

      <div className="bg-white md:p-6 md:rounded-xl md:shadow-sm md:border md:border-gray-100 space-y-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-3">
            {categories.map(category => (
              <label key={category} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                />
                <span className="text-gray-700 group-hover:text-orange-600 transition-colors">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
          <input 
            type="range"
            min="0"
            max="15000"
            step="500"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2 font-medium">
            <span>₹0</span>
            <span className="text-orange-600">Up to ₹{priceRange.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <button 
          onClick={clearFilters}
          className="w-full py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Clear Filters
        </button>
        
        <div className="md:hidden mt-8 pt-6 border-t">
          <button 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="w-full py-3 bg-orange-600 text-white font-medium rounded-lg shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}