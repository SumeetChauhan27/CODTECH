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
}