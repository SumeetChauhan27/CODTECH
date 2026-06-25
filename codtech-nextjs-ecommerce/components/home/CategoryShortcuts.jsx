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
}