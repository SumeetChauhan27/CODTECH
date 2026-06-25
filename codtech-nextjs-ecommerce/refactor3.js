const fs = require('fs');
const path = require('path');

const components = {
  'components/productDetail/ImageGallery.jsx': `
import Image from "next/image";

export default function ImageGallery({ product }) {
  return (
    <div className="sticky top-24">
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
        <Image 
          src={product.images[0]} 
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-700"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={\`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 \${i === 0 ? "border-orange-600" : "border-transparent opacity-70 hover:opacity-100"}\`}>
            <Image src={product.images[0]} alt="thumbnail" fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}`,

  'components/productDetail/ProductInfo.jsx': `
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
                  className={\`px-5 py-2.5 border rounded-lg text-sm font-bold transition-all \${
                    selectedColor === color 
                      ? "border-orange-600 text-orange-600 bg-orange-50 ring-2 ring-orange-600/20" 
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }\`}
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
                  className={\`w-14 h-14 flex items-center justify-center border rounded-xl text-sm font-bold transition-all \${
                    selectedSize === size 
                      ? "border-orange-600 text-orange-600 bg-orange-50 ring-2 ring-orange-600/20" 
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }\`}
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
          className={\`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md \${
            canAddToCart 
              ? "bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 text-white" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }\`}
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
}`,

  'components/productDetail/ProductTabs.jsx': `
import { FaStar } from "react-icons/fa";

export default function ProductTabs({ product, activeTab, setActiveTab }) {
  return (
    <div className="mt-auto border-t border-gray-200 pt-8" id="reviews">
      <div className="flex gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab("description")}
          className={\`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative \${
            activeTab === "description" ? "text-orange-600" : "text-gray-400 hover:text-gray-900"
          }\`}
        >
          Description
          {activeTab === "description" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-md"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("specifications")}
          className={\`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative \${
            activeTab === "specifications" ? "text-orange-600" : "text-gray-400 hover:text-gray-900"
          }\`}
        >
          Specs
          {activeTab === "specifications" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-md"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("reviews")}
          className={\`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative \${
            activeTab === "reviews" ? "text-orange-600" : "text-gray-400 hover:text-gray-900"
          }\`}
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
}`
};

for (const [filepath, content] of Object.entries(components)) {
  const fullPath = path.join(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}
console.log("Refactored components 3 created!");
