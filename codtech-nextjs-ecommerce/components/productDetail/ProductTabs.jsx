import { FaStar } from "react-icons/fa";

export default function ProductTabs({ product, activeTab, setActiveTab }) {
  return (
    <div className="mt-auto border-t border-gray-200 pt-8" id="reviews">
      <div className="flex gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab("description")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === "description" ? "text-orange-600" : "text-gray-400 hover:text-gray-900"
          }`}
        >
          Description
          {activeTab === "description" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-md"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("specifications")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === "specifications" ? "text-orange-600" : "text-gray-400 hover:text-gray-900"
          }`}
        >
          Specs
          {activeTab === "specifications" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-md"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("reviews")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === "reviews" ? "text-orange-600" : "text-gray-400 hover:text-gray-900"
          }`}
        >
          Reviews
          {activeTab === "reviews" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-md"></div>}
        </button>
      </div>
      
      <div className="min-h-[200px]">
        {activeTab === "description" && (
          <div className="prose prose-sm md:prose-base max-w-none text-gray-600 leading-loose">
            <p>{product.description}</p>
            <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        )}
        
        {activeTab === "specifications" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex flex-col pb-4 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{key}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "reviews" && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 bg-orange-50 p-6 rounded-2xl mb-8">
              <div className="text-6xl font-black text-orange-600 tracking-tighter">{product.rating}</div>
              <div>
                <div className="flex text-yellow-400 text-xl mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-orange-200"} />
                  ))}
                </div>
                <div className="text-sm font-medium text-orange-800">Based on {product.reviewCount} verified reviews</div>
              </div>
            </div>
            {/* Mock Review */}
            <div className="border-b border-gray-100 pb-8">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Great product, highly recommend!</h4>
                  <div className="flex text-yellow-400 text-sm mt-2">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">2 days ago</span>
              </div>
              <p className="text-base text-gray-600 mt-4 leading-relaxed">Exceeded my expectations. The quality is fantastic and it arrived much faster than I anticipated. Will definitely be ordering from ShopEase again. The packaging was also very secure.</p>
              <div className="text-sm font-bold text-gray-900 mt-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">AJ</div>
                Alex J. <span className="text-green-600 font-bold text-xs ml-2 bg-green-50 px-2 py-0.5 rounded-full">Verified Buyer</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}