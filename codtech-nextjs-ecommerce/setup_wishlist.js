const fs = require('fs');
const path = require('path');

const filesToUpdate = {
  'context/WishlistContext.jsx': `
"use client";

import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        toast.success("Removed from wishlist");
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.success("Added to wishlist!");
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
`,
  'app/layout.js': `
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShopEase | Next.js E-Commerce",
  description: "A premium e-commerce application built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={\`\${inter.className} bg-gray-50 flex flex-col min-h-screen text-gray-900\`}>
        <WishlistProvider>
          <CartProvider>
            <Suspense fallback={<div className="h-16 w-full bg-white/80 border-b border-gray-200"></div>}>
              <Navbar />
            </Suspense>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
`,
  'components/ui/ProductCard.jsx': `
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
    <Link href={\`/products/\${product.id}\`} className="group relative block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
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
          className={\`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors \${
            product.inStock 
              ? "bg-orange-600 hover:bg-orange-700 text-white" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }\`}
        >
          <FiShoppingCart />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </Link>
  );
}
`,
  'components/productDetail/ProductInfo.jsx': `
"use client";

import { FaStar } from "react-icons/fa";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductInfo({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  handleAddToCart,
  setActiveTab
}) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isColorRequired = product.colors?.length > 0;
  const isSizeRequired = product.sizes?.length > 0;
  
  const canAddToCart = product.inStock && 
    (!isColorRequired || selectedColor) && 
    (!isSizeRequired || selectedSize);

  const isWishlist = isInWishlist(product.id);

  return (
    <>
      <div className="mb-3">
        <span className="text-xs font-bold tracking-widest text-orange-600 uppercase bg-orange-50 px-3 py-1 rounded-full">{product.category}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
      
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"} size={18} />
          ))}
        </div>
        <span className="text-sm font-bold text-gray-900">{product.rating}</span>
        <span className="text-gray-300">|</span>
        <a href="#reviews" onClick={(e) => { e.preventDefault(); setActiveTab("reviews"); }} className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
          {product.reviewCount} Reviews
        </a>
      </div>

      <div className="flex items-end gap-4 mb-8">
        <span className="text-4xl font-black text-gray-900 tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
        {product.originalPrice && (
          <span className="text-xl text-gray-400 line-through mb-1 font-medium">₹{product.originalPrice.toLocaleString("en-IN")}</span>
        )}
        {product.originalPrice && (
          <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-2">
            SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Variants */}
      <div className="space-y-8 mb-10">
        {isColorRequired && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900">Color</h3>
              <span className="text-sm font-medium text-gray-500">{selectedColor || "Select a color"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={\`px-5 py-2.5 border rounded-lg text-sm font-bold transition-all \${
                    selectedColor === color 
                      ? "border-orange-600 text-orange-600 bg-orange-50 ring-2 ring-orange-600/20" 
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }\`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {isSizeRequired && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900">Size</h3>
              <span className="text-sm font-medium text-orange-600 cursor-pointer hover:underline">Size Guide</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={\`w-14 h-14 flex items-center justify-center border rounded-xl text-sm font-bold transition-all \${
                    selectedSize === size 
                      ? "border-orange-600 text-orange-600 bg-orange-50 ring-2 ring-orange-600/20" 
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }\`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-14">
        <div className="w-full sm:w-32 h-14 [&>*]:h-full [&>*]:w-full">
          <QuantityStepper quantity={quantity} setQuantity={setQuantity} min={1} />
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className={\`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md \${
            canAddToCart 
              ? "bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 text-white" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }\`}
        >
          <FiShoppingCart size={22} />
          {!product.inStock 
            ? "Out of Stock" 
            : (!selectedColor && isColorRequired) || (!selectedSize && isSizeRequired) 
              ? "Select Variant" 
              : "Add to Cart"}
        </button>
        
        <button 
          onClick={() => toggleWishlist(product)}
          className="h-14 w-14 flex-shrink-0 flex items-center justify-center border-2 border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
        >
          <FiHeart size={24} className={isWishlist ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>
    </>
  );
}
`,
  'app/wishlist/page.js': `
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
`
};

for (const [filepath, content] of Object.entries(filesToUpdate)) {
  const fullPath = path.join(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}
console.log("Wishlist implementation completed!");
