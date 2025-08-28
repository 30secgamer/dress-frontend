import { motion } from "framer-motion";

const SplashScreen = () => {
  const particles = Array.from({ length: 25 });

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#4B0082] via-[#2E0854] to-[#4B0082]">
      
      {/* Floating Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-20"
          animate={{
            x: [`${Math.random() * 300 - 150}%`, `${Math.random() * 300 - 150}%`],
            y: [`${Math.random() * 300 - 150}%`, `${Math.random() * 300 - 150}%`],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6 + Math.random() * 3,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Glowing Brand Name */}
      <motion.h1
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="text-7xl md:text-9xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDF6F0] to-[#FFD700] drop-shadow-lg"
      >
        Dressify
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 1.2 }}
        className="absolute bottom-24 text-xl md:text-3xl text-[#FDF6F0] font-light tracking-wide drop-shadow-md"
      >
        ✨ Elegance in Every Stitch ✨
      </motion.p>

      {/* Soft Glow Blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-[#FFD700] rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] bg-[#FDF6F0] rounded-full opacity-5 blur-2xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.02, 0.1, 0.02] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
      />

    </div>
  );
};

export default SplashScreen;
