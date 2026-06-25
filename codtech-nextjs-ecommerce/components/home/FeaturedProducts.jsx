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
}