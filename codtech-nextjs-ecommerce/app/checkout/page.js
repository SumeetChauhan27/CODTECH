"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { FiCheckCircle, FiShield } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const shipping = totalPrice > 2000 ? 0 : 150;
  const finalTotal = totalPrice + shipping;

  // Redirect if cart is empty and order not complete
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push("/cart");
    }
  }, [items.length, orderComplete, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      clearCart();
      toast.success("Order placed successfully!");
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <FiCheckCircle className="text-green-500 w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md leading-relaxed">
          Thank you for shopping with ShopEase. Your order has been successfully placed and is being processed for shipping.
        </p>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md mb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Order Number</p>
          <p className="font-mono font-black text-3xl text-gray-900 tracking-wider">#{orderId}</p>
        </div>
        <Link href="/" className="bg-gray-900 hover:bg-black text-white font-bold text-lg px-10 py-4 rounded-full transition-all shadow-md hover:shadow-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) return null; // Prevents flash before redirect

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">Checkout Securely</h1>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              <ShippingForm />
              <PaymentMethod />

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full h-16 font-bold text-xl rounded-xl flex items-center justify-center gap-3 transition-all shadow-md ${
                  isSubmitting 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-gray-900 hover:bg-black text-white hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Securely...
                  </>
                ) : (
                  <>
                    <FiShield size={20} />
                    Pay ₹{finalTotal.toLocaleString("en-IN")}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-200">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow pt-1">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight mb-1">{item.name}</h4>
                      <p className="text-sm font-medium text-orange-600">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm font-medium text-gray-600 mb-6 border-t border-gray-100 pt-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping.toLocaleString("en-IN")}`}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-gray-900 tracking-tight">₹{finalTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}