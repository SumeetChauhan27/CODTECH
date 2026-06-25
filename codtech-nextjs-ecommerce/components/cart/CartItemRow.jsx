import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

export default function CartItemRow({ item, index, updateQuantity, removeFromCart }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
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
  );
}