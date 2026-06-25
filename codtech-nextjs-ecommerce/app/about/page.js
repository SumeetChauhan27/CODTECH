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