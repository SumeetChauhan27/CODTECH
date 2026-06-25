"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  
  // Initialize search query from URL to fix persistence issue
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/products');
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <FiShoppingBag className="text-orange-600" />
              <span>ShopEase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                  pathname === link.href ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-3 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-orange-600 text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="bg-orange-600 text-white px-3 py-1.5 rounded-r-md">
                  <FiSearch />
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
                <FiSearch size={20} />
              </button>
            )}

            <Link href="/wishlist" className="p-2 text-gray-600 hover:text-orange-600 transition-colors relative">
              <FiHeart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="p-2 text-gray-600 hover:text-orange-600 transition-colors relative">
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link href="/profile" className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <FiUser size={20} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="p-2 mr-2 text-gray-600 relative">
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="mb-4 flex px-3">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-orange-600 text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-r-md">
                <FiSearch />
              </button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-50 hover:text-orange-600 ${
                  pathname === link.href ? "text-orange-600 bg-orange-50" : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex space-x-4 px-3 py-2 border-t border-gray-100 mt-2">
              <Link href="/wishlist" className="flex items-center text-gray-600 hover:text-orange-600">
                <FiHeart className="mr-2" /> Wishlist
                {wishlistItems.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="flex items-center text-gray-600 hover:text-orange-600">
                <FiUser className="mr-2" /> Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}