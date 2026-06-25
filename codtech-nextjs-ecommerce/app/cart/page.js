"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/cart/OrderSummary";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(totalPrice * 0.1);
      toast.success("Coupon applied! 10% off.");
    } else {
      toast.error("Invalid coupon code.");
      setDiscount(0);
    }
  };

  const shipping = (totalPrice - discount) > 2000 ? 0 : 150;
  const finalTotal = totalPrice - discount + shipping;

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
              <CartItemRow 
                key={`${item.productId}-${index}`} 
                item={item} 
                index={index} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
              />
            ))}
            
            {/* Coupon Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 mt-6">
              <input 
                type="text" 
                placeholder="Enter promo code (Try SAVE10)" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors text-gray-900"
              />
              <button 
                onClick={applyCoupon}
                className="w-full sm:w-auto px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <OrderSummary 
              items={items} 
              totalPrice={totalPrice} 
              shipping={shipping} 
              finalTotal={finalTotal} 
              discount={discount} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}