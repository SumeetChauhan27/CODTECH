import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  // Grab the first 4 products for the featured section
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80" },
    { name: "Clothing", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80" },
    { name: "Home", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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

      {/* Category Shortcuts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                href={`/products?category=${encodeURIComponent(category.name)}`}
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

      {/* Featured Products */}
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

      {/* Promotional Banner / Newsletter */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 10% off your first order</h2>
          <p className="text-gray-400 mb-8">Subscribe to our newsletter and be the first to know about new arrivals and special promotions.</p>
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
