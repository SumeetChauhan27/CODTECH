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