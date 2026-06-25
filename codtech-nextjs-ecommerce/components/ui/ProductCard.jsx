"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Default to the first available size and color if variants exist
    const defaultVariant = {};
    if (product.colors?.length > 0) defaultVariant.color = product.colors[0];
    if (product.sizes?.length > 0) defaultVariant.size = product.sizes[0];
    
    addToCart(product, 1, Object.keys(defaultVariant).length > 0 ? defaultVariant : null);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="group relative block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image 
          src={product.images[0]} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white text-gray-600 hover:text-red-500 transition-colors z-10"
        >
          <FiHeart className={isWishlist ? "fill-red-500 text-red-500" : ""} />
        </button>
        
        {/* Out of Stock Badge */}
        {!product.inStock && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded shadow-sm">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-xs font-medium text-orange-600 mb-1">{product.category}</div>
        <h3 className="font-semibold text-gray-900 truncate mb-1">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-3">
          <FaStar className="text-yellow-400 text-sm" />
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-sm text-gray-400">({product.reviewCount})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            product.inStock 
              ? "bg-orange-600 hover:bg-orange-700 text-white" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FiShoppingCart />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </Link>
  );
}