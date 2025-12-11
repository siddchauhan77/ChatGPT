import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';

const ThemesSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col p-8 bg-zinc-950 justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-8"
      >
        <h2 className="text-3xl font-black text-white">Your 2024 Main Characters</h2>
        <p className="text-zinc-400 mt-2 font-medium">The 5 themes that ruled your chat history.</p>
      </motion.div>

      <div className="relative z-10 space-y-3">
        {data.persona.topThemes.slice(0, 5).map((theme, i) => (
          <motion.div
            key={i}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + (i * 0.15), type: "spring" }}
            className="flex items-center gap-4"
          >
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-zinc-700 to-zinc-800 select-none">
              {i + 1}
            </span>
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex-1 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors">
              <span className="text-xl font-bold text-white tracking-tight">{theme}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ThemesSlide;