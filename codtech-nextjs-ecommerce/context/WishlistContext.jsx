"use client";

import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    
    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      toast.success("Removed from wishlist");
    } else {
      setWishlistItems((prev) => [...prev, product]);
      toast.success("Added to wishlist!");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};