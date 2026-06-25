import HeroBanner from "@/components/home/HeroBanner";
import CategoryShortcuts from "@/components/home/CategoryShortcuts";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <CategoryShortcuts />
      <FeaturedProducts />
      
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
