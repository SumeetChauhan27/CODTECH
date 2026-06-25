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
          <input type="text" required pattern="(0[1-9]|1[0-2])\/[0-9]{2}" maxLength="5" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white font-mono" placeholder="MM/YY" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
          <input type="password" required pattern="[0-9]{3,4}" maxLength="4" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-orange-500 outline-none transition-colors bg-gray-50 focus:bg-white font-mono tracking-widest" placeholder="***" />
        </div>
      </div>
    </div>
  );
}