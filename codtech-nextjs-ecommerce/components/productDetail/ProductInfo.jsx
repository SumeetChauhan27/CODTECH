import { FaStar } from "react-icons/fa";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import QuantityStepper from "@/components/ui/QuantityStepper";

export default function ProductInfo({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  handleAddToCart,
  setActiveTab
}) {
  const isColorRequired = product.colors?.length > 0;
  const isSizeRequired = product.sizes?.length > 0;
  
  const canAddToCart = product.inStock && 
    (!isColorRequired || selectedColor) && 
    (!isSizeRequired || selectedSize);

  return (
    <>
      <div className="mb-3">
        <span className="text-xs font-bold tracking-widest text-orange-600 uppercase bg-orange-50 px-3 py-1 rounded-full">{product.category}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
      
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"} size={18} />
          ))}
        </div>
        <span className="text-sm font-bold text-gray-900">{product.rating}</span>
        <span className="text-gray-300">|</span>
        <a href="#reviews" onClick={(e) => { e.preventDefault(); setActiveTab("reviews"); }} className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
          {product.reviewCount} Reviews
        </a>
      </div>

      <div className="flex items-end gap-4 mb-8">
        <span className="text-4xl font-black text-gray-900 tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
        {product.originalPrice && (
          <span className="text-xl text-gray-400 line-through mb-1 font-medium">₹{product.originalPrice.toLocaleString("en-IN")}</span>
        )}
        {product.originalPrice && (
          <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-2">
            SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Variants */}
      <div className="space-y-8 mb-10">
        {isColorRequired && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900">Color</h3>
              <span className="text-sm font-medium text-gray-500">{selectedColor || "Select a color"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-5 py-2.5 border rounded-lg text-sm font-bold transition-all ${
                    selectedColor === color 
                      ? "border-orange-600 text-orange-600 bg-orange-50 ring-2 ring-orange-600/20" 
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {isSizeRequired && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900">Size</h3>
              <span className="text-sm font-medium text-orange-600 cursor-pointer hover:underline">Size Guide</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 flex items-center justify-center border rounded-xl text-sm font-bold transition-all ${
                    selectedSize === size 
                      ? "border-orange-600 text-orange-600 bg-orange-50 ring-2 ring-orange-600/20" 
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-14">
        <div className="w-full sm:w-32 h-14 [&>*]:h-full [&>*]:w-full">
          <QuantityStepper quantity={quantity} setQuantity={setQuantity} min={1} />
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className={`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md ${
            canAddToCart 
              ? "bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 text-white" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FiShoppingCart size={22} />
          {!product.inStock 
            ? "Out of Stock" 
            : (!selectedColor && isColorRequired) || (!selectedSize && isSizeRequired) 
              ? "Select Variant" 
              : "Add to Cart"}
        </button>
        
        <button className="h-14 w-14 flex-shrink-0 flex items-center justify-center border-2 border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
          <FiHeart size={24} />
        </button>
      </div>
    </>
  );
}