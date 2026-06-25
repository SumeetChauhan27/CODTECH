"use client";

import React from "react";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {wishlistItems.length === 0 ? (
          <>
            <div className="w-28 h-28 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FiHeart size={56} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Wishlist</h1>
            <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">You haven't saved any items yet. Save items you love and they will appear here.</p>
            <Link href="/products" className="bg-gray-900 hover:bg-black text-white font-bold text-lg px-10 py-4 rounded-full transition-all shadow-md hover:shadow-lg inline-block">
              Explore Products
            </Link>
          </>
        ) : (
          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Your Wishlist</h1>
            <p className="text-lg text-gray-500 mb-8">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}