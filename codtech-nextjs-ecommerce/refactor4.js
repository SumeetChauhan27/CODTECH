const fs = require('fs');
const path = require('path');

const components = {
  'components/cart/CartItemRow.jsx': `
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

export default function CartItemRow({ item, index, updateQuantity, removeFromCart }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
      <Link href={\`/products/\${item.productId}\`} className="relative w-full sm:w-32 h-48 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group">
        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      
      <div className="flex flex-col flex-grow w-full h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link href={\`/products/\${item.productId}\`}>
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
  );
}`,

  'components/cart/OrderSummary.jsx': `
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function OrderSummary({ items, totalPrice, shipping, finalTotal, discount }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4 text-sm font-medium text-gray-600 mb-6 border-b border-gray-100 pb-6">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span className="font-bold text-gray-900 text-base">₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount (10%)</span>
            <span className="font-bold text-base">-₹{discount.toLocaleString("en-IN")}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Shipping Estimate</span>
          <span className="font-bold text-gray-900 text-base">{shipping === 0 ? <span className="text-green-600 font-black">FREE</span> : \`₹\${shipping.toLocaleString("en-IN")}\`}</span>
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
  );
}`,

  'components/checkout/ShippingForm.jsx': `
export default function ShippingForm() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">1</span>
        Shipping Address
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
          <input type="text" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="John Doe" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <input type="email" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="john@example.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
          <input type="text" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="123 Main St, Apt 4B" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
          <input type="text" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="Mumbai" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
          <input type="text" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="400001" />
        </div>
      </div>
    </div>
  );
}`,

  'components/checkout/PaymentMethod.jsx': `
import { FiLock } from "react-icons/fi";

export default function PaymentMethod() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">2</span>
          Payment Method
        </h2>
        <div className="flex items-center text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <FiLock className="mr-1.5" size={14} /> 256-bit Secure
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
          <div className="relative">
            <input type="text" required pattern="[0-9]{16}" maxLength="16" className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white font-mono" placeholder="0000 0000 0000 0000" />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
          <input type="text" required pattern="(0[1-9]|1[0-2])\\/[0-9]{2}" maxLength="5" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white font-mono" placeholder="MM/YY" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
          <input type="password" required pattern="[0-9]{3,4}" maxLength="4" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white font-mono tracking-widest" placeholder="***" />
        </div>
      </div>
    </div>
  );
}`,

  'app/cart/page.js': `
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
                key={\`\${item.productId}-\${index}\`} 
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors"
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
}`,

  'app/checkout/page.js': `
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
      setOrderId(\`ORD-\${Math.floor(100000 + Math.random() * 900000)}\`);
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
                className={\`w-full h-16 font-bold text-xl rounded-xl flex items-center justify-center gap-3 transition-all shadow-md \${
                  isSubmitting 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-gray-900 hover:bg-black text-white hover:shadow-xl hover:-translate-y-0.5"
                }\`}
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
                  <span className="font-bold text-gray-900">{shipping === 0 ? <span className="text-green-600">FREE</span> : \`₹\${shipping.toLocaleString("en-IN")}\`}</span>
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
}`
};

for (const [filepath, content] of Object.entries(components)) {
  const fullPath = path.join(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}
console.log("Refactored components 4 created!");
