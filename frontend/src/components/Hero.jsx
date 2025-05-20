"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function AnimatedTitle() {
  return (
    <div className="overflow-hidden">
      <motion.h1
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-6xl font-bold text-white drop-shadow-lg mb-8"
      >
        LEZZETİN ADRESİ
      </motion.h1>
    </div>
  );
}

function AnimatedSubtitle() {
  return (
    <div className="overflow-hidden">
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="text-4xl font-bold text-white mb-4"
      >
        Unutulmaz Lezzet Deneyimi
      </motion.h2>
    </div>
  );
}

function AnimatedButton() {
  return (
    <motion.a
      href="/menu"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: 1.0,
        type: "spring",
        stiffness: 120,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: "#b91c1c", // red-700
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.4 }
      }}
      className="mt-8 inline-block px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
    >
      MENÜMÜZÜ KEŞFET
    </motion.a>
  );
}

export default function Hero() {
  return (
    <section className="h-screen relative overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.2, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 4.5 }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'url("https://res.cloudinary.com/dn3bikzbm/image/upload/v1746196568/giphy_zezoig.gif")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)'
          }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-4xl mx-auto px-4">
        <AnimatedTitle />
        <AnimatedSubtitle />
        <AnimatedButton />
      </div>
    </section>
  );
} 