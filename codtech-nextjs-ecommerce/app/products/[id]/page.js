import { products } from "@/data/products";
import ProductDetailClient from "@/components/productDetail/ProductDetailClient";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export function generateMetadata({ params }) {
  const product = products.find(p => p.id === params.id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | ShopEase`,
    description: product.description
  };
}

// Generate static params so the pages can be statically exported/built
export function generateStaticParams() {
  return products.map(product => ({
    id: String(product.id),
  }));
}

export default function ProductDetailPage({ params }) {
  const product = products.find(p => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-lg text-gray-500 mb-8 text-center max-w-md">The product you are looking for might have been removed or does not exist.</p>
        <Link href="/products" className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded-full transition-colors shadow-md">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors bg-gray-50 px-4 py-2 rounded-lg">
            <FiArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
