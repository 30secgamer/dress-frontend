import React from "react";
import { motion } from "framer-motion";

const ProductCard = ({ product, onViewDetails, quantities = {}, onQuantityChange }) => {
  const quantity = quantities[product._id] || 1;
  const percentOff = product.discountedPrice ? Math.round((1 - product.discountedPrice / product.originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-xl mb-4 transition-transform duration-500 hover:scale-110" />
      <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>

      {product.discountedPrice ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mt-1 text-lg">
          <p className="line-through text-gray-400">₹{product.originalPrice}</p>
          <p className="text-purple-600 font-semibold">₹{product.discountedPrice}</p>
          <p className="text-green-500 font-semibold">({percentOff}% OFF)</p>
        </motion.div>
      ) : (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-600 font-semibold mt-1 text-lg">₹{product.originalPrice}</motion.p>
      )}

      <div className="flex items-center mt-3 gap-2">
        <button onClick={() => onQuantityChange(product._id, quantity - 1)} className="px-3 py-1 bg-purple-200 rounded hover:bg-purple-300 transition-colors duration-300">-</button>
        <span className="px-4 font-semibold">{quantity}</span>
        <button onClick={() => onQuantityChange(product._id, quantity + 1)} className="px-3 py-1 bg-purple-200 rounded hover:bg-purple-300 transition-colors duration-300">+</button>
      </div>

      <button onClick={() => onViewDetails(product)} className="mt-4 w-full bg-purple-600 hover:bg-pink-400 text-white py-2 rounded-full font-bold transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
        View Details
      </button>
    </div>
  );
};

export default ProductCard;
