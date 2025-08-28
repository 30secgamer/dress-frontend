import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Splash screen timer reduced
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (productId, value) => {
    if (value < 1) value = 1;
    setQuantities(prev => ({ ...prev, [productId]: value }));
  };

  const handleViewDetails = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  const addToCart = (product, selectedSize) => {
    const qty = quantities[product._id] || 1;
    const existing = cart.find(item => item._id === product._id && item.size === selectedSize);
    if (existing) {
      setCart(prev =>
        prev.map(item =>
          item._id === product._id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      setCart(prev => [
        ...prev,
        { ...product, size: selectedSize, quantity: qty, originalPrice: product.originalPrice, discountedPrice: product.discountedPrice || null }
      ]);
    }
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item._id === productId && item.size === size)));
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} // faster fade-out
          >
            <SplashScreen />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }} // faster fade-in
          >
            {/* Navbar with premium animation */}
            <motion.div
              initial={{ y: -150, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 12,
                mass: 0.8,
                delay: 0.3 // slight delay for smooth feel
              }}
              className="relative z-50"
            >
              {/* Gradient glow behind navbar */}
              <motion.div
                className="absolute inset-0 rounded-b-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 opacity-30 blur-3xl pointer-events-none"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.3, scaleX: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                className="relative"
              >
                <Navbar
                  isAdminLoggedIn={isAdminLoggedIn}
                  cart={cart}
                  setCart={setCart}
                  removeFromCart={removeFromCart}
                />
              </motion.div>
            </motion.div>

            <Routes>
              {/* Home Page */}
              <Route
                path="/"
                element={
                  <motion.div
                    className="pt-16 md:pt-20 lg:pt-24 bg-gradient-to-b from-purple-50 via-purple-100 to-pink-50 min-h-screen"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }} // slightly faster
                  >
                    <ProductList
                      quantities={quantities}
                      onQuantityChange={handleQuantityChange}
                      onViewDetails={handleViewDetails}
                    />
                    {selectedProduct && (
                      <ProductModal
                        product={selectedProduct}
                        onClose={handleCloseModal}
                        quantities={quantities}
                        onQuantityChange={handleQuantityChange}
                        addToCart={addToCart}
                      />
                    )}
                  </motion.div>
                }
              />

              {/* Login Page */}
              <Route
                path="/login"
                element={<Login setIsAdminLoggedIn={setIsAdminLoggedIn} />}
              />

              {/* Admin Page */}
              <Route
                path="/admin"
                element={
                  isAdminLoggedIn ? <AdminPanel /> : <Navigate to="/login" replace />
                }
              />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
