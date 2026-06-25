import React from "react";
import Link from "next/link";
import { FiFacebook, FiInstagram, FiTwitter, FiShoppingBag, FiMail, FiPhone } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopEase. Built by Sumeet Chauhan for CODTECH IT Solutions.</p>
        </div>
      </div>
    </footer>
  );
}
