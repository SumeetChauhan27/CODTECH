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
  );
}