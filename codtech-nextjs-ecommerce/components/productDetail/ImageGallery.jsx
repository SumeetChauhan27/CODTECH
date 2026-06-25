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
          <div key={i} className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${i === 0 ? "border-orange-600" : "border-transparent opacity-70 hover:opacity-100"}`}>
            <Image src={product.images[0]} alt="thumbnail" fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}