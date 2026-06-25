"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
      <input 
        type="email" 
        placeholder="Enter your email" 
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button 
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
