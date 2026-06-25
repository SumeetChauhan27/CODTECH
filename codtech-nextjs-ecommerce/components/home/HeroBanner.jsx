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
}