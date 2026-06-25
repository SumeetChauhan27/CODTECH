const fs = require('fs');
const path = require('path');

const components = {
  'components/home/HeroBanner.jsx': `
import Image from "next/image";
import Link from "next/link";
export default function HeroBanner() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" 
          alt="Hero Background" 
          fill
          priority
          className="object-cover brightness-50"
        />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          New Season Arrivals
        </h1>
        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Discover styles made for you. Upgrade your lifestyle with our premium collection of electronics, fashion, and home goods.
        </p>
        <Link 
          href="/products" 
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-lg"
        >
          Shop Now &rarr;
        </Link>
      </div>
    </section>
  );
}`,
  'components/home/CategoryShortcuts.jsx': `
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
export default function CategoryShortcuts() {
  const categories = Array.from(new Set(products.map(p => p.category))).map(name => {
    const images = {
      "Electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
      "Clothing": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      "Home": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      "Sports": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80"
    };
    return { name, image: images[name] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" };
  });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={"/products?category=" + encodeURIComponent(category.name)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
            >
              <Image 
                src={category.image} 
                alt={category.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}`,
  'components/home/FeaturedProducts.jsx': `
import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 4);
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products" className="text-orange-600 font-medium hover:text-orange-700 hidden sm:block">
            View All &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-10 text-center sm:hidden">
          <Link href="/products" className="inline-block bg-white border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg w-full text-center hover:bg-gray-50">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}`,
'components/ui/Breadcrumb.jsx': `
import Link from "next/link";
export default function Breadcrumb({ category, name }) {
  return (
    <nav className="text-sm mb-6 text-gray-500">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <span className="mx-2">/</span>
        </li>
        <li className="flex items-center">
          <Link href={"/products?category=" + encodeURIComponent(category)} className="hover:text-orange-600">{category}</Link>
          <span className="mx-2">/</span>
        </li>
        <li className="text-gray-900 font-medium truncate max-w-xs">{name}</li>
      </ol>
    </nav>
  );
}`,
'components/ui/QuantityStepper.jsx': `
export default function QuantityStepper({ quantity, setQuantity, min = 1, onUpdate }) {
  const decrease = () => {
    if (quantity > min) {
      if (onUpdate) onUpdate(quantity - 1);
      else setQuantity(quantity - 1);
    }
  };
  const increase = () => {
    if (onUpdate) onUpdate(quantity + 1);
    else setQuantity(quantity + 1);
  };
  return (
    <div className="flex items-center border border-gray-300 rounded-lg">
      <button 
        className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        onClick={decrease}
        disabled={quantity <= min}
      >
        -
      </button>
      <span className="px-4 py-2 font-medium">{quantity}</span>
      <button 
        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
        onClick={increase}
      >
        +
      </button>
    </div>
  );
}`
};

for (const [filepath, content] of Object.entries(components)) {
  const fullPath = path.join(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}
console.log("Refactored components created!");
