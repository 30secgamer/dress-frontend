import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = ({ isAdminLoggedIn, cart, setCart, removeFromCart, showCart }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const phone = "919633663256";

  const handleQuantityChange = (productId, size, delta) => {
    setCart(
      cart.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

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

  return (
    <nav className="bg-purple-700 p-4 flex justify-between items-center text-white shadow-lg fixed w-full z-50">
      <Link
        to="/"
        className="font-bold text-2xl tracking-wide hover:text-pink-300 transition-colors"
      >
        Dressify
      </Link>

      <div className="flex items-center gap-4">
        {isAdminLoggedIn && (
          <Link to="/admin" className="hover:text-pink-300 transition-colors">
            Admin
          </Link>
        )}

        <button
          className="relative"
          onClick={() => {
            setIsCartOpen((prev) => !prev);
            showCart && showCart();
          }}
        >
          <FaShoppingCart size={26} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-bounce">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        </button>
      </div>

      {isCartOpen && (
        <div className="absolute right-4 top-14 w-96 bg-white text-gray-900 border rounded-xl shadow-2xl p-4 max-h-96 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Your cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => {
                const originalTotal = item.originalPrice * item.quantity;
                const offerTotal = item.discountedPrice ? item.discountedPrice * item.quantity : null;

                return (
                  <li
                    key={item._id + item.size}
                    className="flex justify-between items-center border-b pb-3 hover:bg-purple-50 rounded transition-colors duration-200"
                  >
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

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

                    <div className="flex flex-col gap-1 items-end">
                      <button
                        onClick={() => handleWhatsAppOrder(item)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-lg shadow-md"
                      >
                        Order
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id, item.size)}
                        className="text-red-500 hover:text-red-700 text-lg font-bold"
                      >
                        ✖
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
