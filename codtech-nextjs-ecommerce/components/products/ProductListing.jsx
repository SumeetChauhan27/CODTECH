"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { FiFilter } from "react-icons/fi";
import FilterSidebar from "./FilterSidebar";
import SortBar from "./SortBar";
import ProductGrid from "./ProductGrid";

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

      <FilterSidebar 
        isMobileFiltersOpen={isMobileFiltersOpen}
        setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        clearFilters={clearFilters}
      />

      {/* Main Content */}
      <div className="md:w-3/4 flex flex-col">
        <SortBar 
          filteredCount={filteredProducts.length}
          initialSearch={initialSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <ProductGrid 
          filteredProducts={filteredProducts}
          viewMode={viewMode}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
}
