import React from "react";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductDetailClient from "@/components/productDetail/ProductDetailClient";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/ui/ProductCard";

export async function generateMetadata({ params }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | ShopEase`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  // Find related products (same category, exclude current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb category={product.category} name={product.name} />
        <ProductDetailClient product={product} />
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-100 pt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
