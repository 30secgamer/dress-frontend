import React from "react";
import { BASE_URL } from "../config"; // adjust path if needed

const CartModal = ({ cart, setCart, onClose }) => {
  const phone = "919633663256";

  const handleWhatsAppOrder = (item) => {
    const originalTotal = item.originalPrice * item.quantity;
    const offerTotal = item.discountedPrice ? item.discountedPrice * item.quantity : null;

    let message = `*Order Details:*\n\n${item.name}\nSize: ${item.size || "N/A"}\nQuantity: ${item.quantity}\nPrice: ₹${item.originalPrice} x ${item.quantity} = ₹${originalTotal}`;
    
    if (item.discountedPrice) {
      message += `\nOffer Price: ₹${item.discountedPrice} x ${item.quantity} = ₹${offerTotal}`;
    }

    message += `\n*Total: ₹${offerTotal || originalTotal}*`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleRemove = (productId, size) => {
    setCart(cart.filter((item) => !(item._id === productId && item.size === size)));
  };

  const handleQuantityChange = (productId, size, delta) => {
    setCart(
      cart.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Cart is empty</p>
        ) : (
          <ul className="space-y-4 max-h-80 overflow-y-auto">
            {cart.map((item) => {
              const originalTotal = item.originalPrice * item.quantity;
              const offerTotal = item.discountedPrice ? item.discountedPrice * item.quantity : null;

              return (
                <li key={item._id + item.size} className="flex justify-between items-center border-b pb-3">
                  <img src={`${BASE_URL}${item.image}`} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />

                  <div className="flex-1 ml-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Size: {item.size || "N/A"}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.size, -1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.size, 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(item._id, item.size)}
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="font-semibold mt-1">
                      ₹{originalTotal}
                      {item.discountedPrice && (
                        <span className="text-green-600 ml-1">
                          (Offer: ₹{offerTotal})
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => handleWhatsAppOrder(item)}
                    className="ml-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md"
                  >
                    Order
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CartModal;
