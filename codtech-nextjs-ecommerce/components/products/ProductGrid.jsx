import React, { useState } from 'react';
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { FiFilter } from "react-icons/fi";

export default function ProductGrid({ filteredProducts, viewMode, clearFilters }) {
  const [visibleCount, setVisibleCount] = useState(8);

  const loadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  if (filteredProducts.length === 0) {
    return (
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
    );
  }

  return (
    <div>
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-6"
      }>
        {visibleProducts.map(product => (
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
      
      {visibleCount < filteredProducts.length && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={loadMore}
            className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}