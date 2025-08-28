import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = ({ setIsAdminLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminUser = "admin";
    const adminPass = "1234";

    if (username === adminUser && password === adminPass) {
      setIsAdminLoggedIn(true);
      navigate("/admin");
    } else {
      setError("Invalid username or password ❌");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200">

      {/* Floating blobs */}
      <motion.div
        className="absolute w-96 h-96 bg-pink-300/40 rounded-full top-[-5rem] left-[-5rem] blur-3xl animate-blob"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-purple-300/30 rounded-full bottom-[-4rem] right-[-4rem] blur-3xl animate-blob animation-delay-2000"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Login Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        className="relative z-10 w-full max-w-sm bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-purple-800 mb-6"
        >
          👗 Fashion Admin
        </motion.h1>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mb-4 text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Username */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <label className="block text-gray-700 text-sm mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-sm bg-white/70"
            required
          />
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <label className="block text-gray-700 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-sm bg-white/70"
            required
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Login;
