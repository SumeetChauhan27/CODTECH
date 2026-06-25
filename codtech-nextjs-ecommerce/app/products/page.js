import React, { Suspense } from "react";
import ProductListing from "@/components/products/ProductListing";

export const metadata = {
  title: "Products | ShopEase",
  description: "Browse our complete collection of products",
};

export default function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        </div>
        <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading products...</div>}>
          <ProductListing />
        </Suspense>
      </div>
    </div>
  );
}
