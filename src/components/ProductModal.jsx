import React, { useState } from "react";
import { motion } from "framer-motion";

const ProductModal = ({ product, onClose, quantities = {}, onQuantityChange, addToCart }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const quantity = quantities[product._id] || 1;
  const percentOff = product.discountedPrice
    ? Math.round((1 - product.discountedPrice / product.originalPrice) * 100)
    : 0;

  const handlePayNow = () => {
    const phoneNumber = "919633663256";
    let message = `🛒 Order Details
-------------------
Product: ${product.name}
Size: ${selectedSize || "Not Selected"}
Quantity: ${quantity}
Image: ${product.image}  // Use full Cloudinary URL directly
`;

    if (product.discountedPrice) {
      message += `Original Price: ₹${product.originalPrice}
Offer Price: ₹${product.discountedPrice} (${percentOff}% OFF)
Total Price: ₹${product.discountedPrice * quantity}`;
    } else {
      message += `Price: ₹${product.originalPrice * quantity}`;
    }

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-500">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-96 p-6 relative"
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">✖</button>

        <img src={product.image} alt={product.name} className="w-full h-60 object-cover rounded-xl mb-4" />

        <h2 className="text-xl font-bold mb-2">{product.name}</h2>

        {product.discountedPrice ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-4 text-lg">
            <p className="line-through text-gray-400">₹{product.originalPrice}</p>
            <p className="text-purple-600 font-semibold">₹{product.discountedPrice}</p>
            <p className="text-green-500 font-semibold">({percentOff}% OFF)</p>
          </motion.div>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-600 font-semibold mb-4 text-lg">
            ₹{product.originalPrice}
          </motion.p>
        )}

        <label className="block mb-2 font-semibold">Select Size:</label>
        <div className="flex gap-2 mb-4">
          {["S","M","L","XL"].map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 py-1 rounded border transition-colors ${
                selectedSize === size
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-400 hover:bg-purple-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <label className="block mb-2 font-semibold">Quantity:</label>
        <div className="flex items-center mb-4 gap-2">
          <button onClick={() => onQuantityChange(product._id, quantity - 1)} className="px-3 py-1 bg-purple-200 rounded hover:bg-purple-300 transition-colors duration-300">-</button>
          <input type="number" min="1" value={quantity} onChange={(e) => onQuantityChange(product._id, parseInt(e.target.value))} className="w-20 border rounded text-center"/>
          <button onClick={() => onQuantityChange(product._id, quantity + 1)} className="px-3 py-1 bg-purple-200 rounded hover:bg-purple-300 transition-colors duration-300">+</button>
        </div>

        <button onClick={() => addToCart(product, selectedSize)} className="w-full bg-purple-600 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full mb-2 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
          Add to Cart
        </button>

        <button onClick={handlePayNow} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300">
          Pay Now via WhatsApp
        </button>
      </motion.div>
    </div>
  );
};

export default ProductModal;
