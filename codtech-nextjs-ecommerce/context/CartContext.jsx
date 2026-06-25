"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // In a real app we might persist to localStorage, but PRD says in-memory is fine
  const [items, setItems] = useState([]);
  
  // Calculate totals dynamically whenever items change
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const addToCart = (product, quantity = 1, variant = null) => {
    setItems((prevItems) => {
      // Check if this exact product+variant combination is already in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingItemIndex >= 0) {
        // If it exists, just increment the quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        toast.success(`Increased ${product.name} quantity in cart!`);
        return newItems;
      }

      // If it doesn't exist, push a new line item
      toast.success(`Added ${product.name} to cart!`);
      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0],
          variant
        }
      ];
    });
  };

  const removeFromCart = (productId, variant = null) => {
    setItems((prevItems) => 
      prevItems.filter((item) => !(item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant)))
    );
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId, variant = null, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantities less than 1
    
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const index = newItems.findIndex(
        (item) => item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
      );
      if (index >= 0) {
        newItems[index].quantity = newQuantity;
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
