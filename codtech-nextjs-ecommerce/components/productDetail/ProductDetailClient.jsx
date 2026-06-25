"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [activeTab, setActiveTab] = useState("description");

  const handleAddToCart = () => {
    const variant = {};
    if (selectedColor) variant.color = selectedColor;
    if (selectedSize) variant.size = selectedSize;
    
    addToCart(product, quantity, Object.keys(variant).length > 0 ? variant : null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
      {/* Image Gallery */}
      <div className="md:w-1/2">
        <ImageGallery product={product} />
      </div>

      {/* Product Info */}
      <div className="md:w-1/2 flex flex-col">
        <ProductInfo 
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
          setActiveTab={setActiveTab}
        />

        <ProductTabs 
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
