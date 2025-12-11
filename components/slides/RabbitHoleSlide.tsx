import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';

const RabbitHoleSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col p-6 bg-black relative overflow-hidden justify-center items-center text-center">
        {/* Background Animation: Tunnel Effect */}
        <motion.div 
            className="absolute inset-0 z-0"
            style={{ 
                background: 'conic-gradient(from 0deg at 50% 50%, #000 0deg, #1a1a1a 180deg, #000 360deg)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-black/80 z-0" /> {/* Overlay to darken */}

        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
             <motion.div
                key={i}
                className="absolute w-2 h-2 bg-pink-500 rounded-full blur-sm z-0"
                initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight + 10 }}
                animate={{ y: -50 }}
                transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
             />
        ))}

        <div className="relative z-10 w-full max-w-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="mb-8"
            >
                <span className="text-6xl filter drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">🌀</span>
            </motion.div>

            <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 uppercase tracking-widest mb-8"
            >
                Down The Rabbit Hole
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden group"
            >
                {/* Glitch border effect */}
                <div className="absolute inset-0 border-2 border-pink-500/20 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-4">Most Unhinged Moment</p>
                
                <p className="text-xl md:text-2xl font-medium text-white mb-6 font-serif italic leading-relaxed">
                    "{data.persona.unhingedMoment.quote}"
                </p>
                
                <div className="inline-block bg-pink-500/20 text-pink-300 text-xs font-bold px-3 py-1 rounded-full border border-pink-500/20">
                    {data.persona.unhingedMoment.context}
                </div>
            </motion.div>
        </div>
    </div>
  );
};

export default RabbitHoleSlide;