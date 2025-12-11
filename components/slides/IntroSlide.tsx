import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';

const IntroSlide: React.FC<{ data: WrappedData }> = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-900 to-zinc-950 text-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <span className="text-4xl">🤖</span>
      </motion.div>

      <motion.h1 
        className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200 mb-6 leading-tight"
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        Your<br/>2025<br/>Wrapped
      </motion.h1>
      
      <motion.p
        className="text-xl text-zinc-300 font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
      >
        The year you asked... everything.
      </motion.p>

      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <div className="relative w-16 h-16 mx-auto">
             <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-xs text-green-500/50 mt-4 uppercase tracking-widest font-bold animate-pulse">Analyzing Logs...</p>
      </motion.div>
    </div>
  );
};

export default IntroSlide;