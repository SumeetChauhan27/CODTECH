"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const shipping = totalPrice > 2000 ? 0 : 150;
  const finalTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-28 h-28 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <FiShoppingBag size={56} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h1>
        <p className="text-lg text-gray-500 mb-10 text-center max-w-md">Looks like you haven't added anything to your cart yet. Discover our premium collection and find something you love!</p>
        <Link href="/products" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-10 py-4 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <Link href={`/products/${item.productId}`} className="relative w-full sm:w-32 h-48 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                
                <div className="flex flex-col flex-grow w-full h-full justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-bold text-gray-900 text-lg hover:text-orange-600 transition-colors leading-tight">{item.name}</h3>
                      </Link>
                      {item.variant && (
                        <div className="text-sm font-medium text-gray-500 mt-2 flex gap-4">
                          {item.variant.color && <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">Color: <span className="text-gray-900">{item.variant.color}</span></span>}
                          {item.variant.size && <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">Size: <span className="text-gray-900">{item.variant.size}</span></span>}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId, item.variant)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2.5 bg-gray-50 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 ml-4 flex-shrink-0"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-auto pt-2">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl h-12 bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-4 text-gray-500 hover:text-orange-600 transition-colors h-full flex items-center disabled:opacity-30 disabled:hover:text-gray-500 font-bold"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                        className="px-4 text-gray-500 hover:text-orange-600 transition-colors h-full flex items-center font-bold"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    <span className="text-2xl font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-medium text-gray-600 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-bold text-gray-900 text-base">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span className="font-bold text-gray-900 text-base">{shipping === 0 ? <span className="text-green-600 font-black">FREE</span> : `₹${shipping.toLocaleString("en-IN")}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-4xl font-black text-gray-900 tracking-tight">₹{finalTotal.toLocaleString("en-IN")}</span>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Proceed to Checkout <FiArrowRight size={20} />
              </Link>
              
              <div className="mt-6 text-center text-xs font-medium text-gray-500 bg-gray-50 py-3 rounded-lg border border-gray-100">
                <p>Free shipping on orders over <span className="font-bold text-gray-900">₹2000!</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
