const fs = require('fs');
const path = require('path');

const components = {
  'components/layout/Footer.jsx': `
import React from "react";
import Link from "next/link";
import { FiFacebook, FiInstagram, FiTwitter, FiShoppingBag, FiMail, FiPhone } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <FiShoppingBag className="text-orange-500" />
              <span>ShopEase</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Discover the latest trends in electronics, clothing, home goods, and sports gear. ShopEase brings the best products straight to your door.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiTwitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link></li>
              <li><Link href="/cart" className="hover:text-orange-500 transition-colors">Cart</Link></li>
              <li><Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FiMail className="mr-3 text-orange-500" />
                <a href="mailto:support@shopease.com" className="hover:text-white transition-colors">support@shopease.com</a>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3 text-orange-500" />
                <span>+91-9876543210</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">Get 10% off your first order!</p>
            <form className="flex flex-col space-y-2" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-500"
              />
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopEase. Built by Sumeet Chauhan for CODTECH IT Solutions.</p>
        </div>
      </div>
    </footer>
  );
}
`,

  'components/layout/Navbar.jsx': `
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  
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
      router.push(\`/products?search=\${encodeURIComponent(searchQuery)}\`);
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
                className={\`text-sm font-medium transition-colors hover:text-orange-600 \${
                  pathname === link.href ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600"
                }\`}
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

            <Link href="/wishlist" className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <FiHeart size={20} />
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
                className={\`block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-50 hover:text-orange-600 \${
                  pathname === link.href ? "text-orange-600 bg-orange-50" : "text-gray-700"
                }\`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex space-x-4 px-3 py-2 border-t border-gray-100 mt-2">
              <Link href="/wishlist" className="flex items-center text-gray-600 hover:text-orange-600">
                <FiHeart className="mr-2" /> Wishlist
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
`,

  'app/about/page.js': `
import React from "react";
import { FiUsers, FiAward, FiGlobe } from "react-icons/fi";

export const metadata = {
  title: "About Us | ShopEase",
  description: "Learn more about ShopEase and our mission.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-900 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About ShopEase</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">We are on a mission to bring you the best products at unbeatable prices, delivering joy to your doorstep.</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiUsers size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
            <p className="text-gray-600">Your satisfaction is our top priority. We offer 24/7 support to ensure you have a seamless shopping experience.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAward size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
            <p className="text-gray-600">We carefully curate our catalog, partnering with top brands to ensure every item meets strict quality standards.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiGlobe size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Reach</h3>
            <p className="text-gray-600">No matter where you are, we bring the world's best products directly to you with fast and reliable shipping.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'app/wishlist/page.js': `
import React from "react";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";

export const metadata = {
  title: "My Wishlist | ShopEase",
  description: "Your saved products",
};

export default function WishlistPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-28 h-28 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <FiHeart size={56} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Wishlist</h1>
        <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">You haven't saved any items yet. Save items you love and they will appear here.</p>
        <Link href="/products" className="bg-gray-900 hover:bg-black text-white font-bold text-lg px-10 py-4 rounded-full transition-all shadow-md hover:shadow-lg inline-block">
          Explore Products
        </Link>
      </div>
    </div>
  );
}
`,

  'app/profile/page.js': `
import React from "react";
import { FiUser, FiSettings, FiPackage, FiLogOut } from "react-icons/fi";

export const metadata = {
  title: "My Profile | ShopEase",
  description: "Manage your account",
};

export default function ProfilePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-500">
                <FiUser size={40} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Guest User</h2>
              <p className="text-sm text-gray-500 mb-6">guest@example.com</p>
              <button className="w-full py-2 bg-gray-100 text-gray-700 font-bold rounded-lg mb-2 hover:bg-gray-200 transition-colors">Edit Profile</button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                <li><button className="w-full flex items-center px-6 py-4 text-left hover:bg-gray-50 text-gray-900 font-medium"><FiPackage className="mr-3 text-gray-400" /> My Orders</button></li>
                <li><button className="w-full flex items-center px-6 py-4 text-left hover:bg-gray-50 text-gray-900 font-medium"><FiSettings className="mr-3 text-gray-400" /> Settings</button></li>
                <li><button className="w-full flex items-center px-6 py-4 text-left hover:bg-red-50 text-red-600 font-medium"><FiLogOut className="mr-3" /> Sign Out</button></li>
              </ul>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
                <FiPackage size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No recent orders</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start shopping to see your history here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(components)) {
  const fullPath = path.join(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}
console.log("UI bugs fixed and pages created!");
