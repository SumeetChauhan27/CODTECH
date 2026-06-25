"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { FiGrid, FiList, FiFilter, FiX } from "react-icons/fi";
import Link from "next/link";

export default function ProductListing() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search");

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("popularity");
  
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [priceRange, setPriceRange] = useState(15000); // Max price

  const categories = [...new Set(products.map(p => p.category))];

  // Apply URL params on mount or when they change
  useEffect(() => {
    if (initialCategory && !selectedCategories.includes(initialCategory)) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(15000);
  };

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (initialSearch) {
      const q = initialSearch.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price filter
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Since we don't have dates, just reverse the array as a mock "newest"
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "popularity":
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [selectedCategories, priceRange, sortBy, initialSearch]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Mobile filter toggle */}
      <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 font-medium text-gray-700"
        >
          <FiFilter /> Filters
        </button>
        <span className="text-sm text-gray-500">{filteredProducts.length} Results</span>
      </div>

      {/* Sidebar Filters */}
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

      {/* Main Content */}
      <div className="md:w-3/4 flex flex-col">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <span className="text-sm font-medium text-gray-500">
            Showing <span className="text-gray-900">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
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
        
        {/* Mobile top bar sorting */}
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

        {/* Product Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-6"
          }>
            {filteredProducts.map(product => (
              viewMode === "grid" ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <div key={product.id} className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
                  <Link href={`/products/${product.id}`} className="w-full sm:w-56 h-56 sm:h-auto relative bg-gray-100 flex-shrink-0 block overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {!product.inStock && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded shadow-sm">
                        Out of Stock
                      </div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col justify-center flex-grow">
                    <div className="text-xs font-medium text-orange-600 mb-1">{product.category}</div>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 hover:text-orange-600 transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                      <Link href={`/products/${product.id}`} className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 py-24 px-4 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiFilter className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-8 max-w-md">We couldn't find any products matching your current filters. Try adjusting them or clear all filters to see our full catalog.</p>
            <button 
              onClick={clearFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
