import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';
import { Sparkles, ImageIcon, Zap, Lock, RotateCcw } from 'lucide-react';

interface CreatorSlideProps {
  data: WrappedData;
  restart: () => void;
  onViewInfographic?: (isPro: boolean) => void;
}

const CreatorSlide: React.FC<CreatorSlideProps> = ({ data, restart, onViewInfographic }) => {
  return (
    <div className="w-full h-full flex flex-col p-6 bg-zinc-950 relative overflow-hidden justify-center items-center text-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-zinc-900/50 z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-8">
            <motion.div 
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-6"
            >
                <ImageIcon className="text-white" size={40} />
            </motion.div>
            
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                Immortalize<br/>Your Year
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed px-4">
                Turn your 2025 AI Persona into a stunning, high-definition poster.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
             {/* Flash Trigger */}
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onViewInfographic) onViewInfographic(false);
                }}
                className="flex flex-col items-center bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md hover:bg-zinc-800 transition-colors"
            >
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                    <Zap size={18} className="text-yellow-400" />
                </div>
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Flash</p>
                <p className="text-[10px] text-zinc-500 mb-3">Free & Fast</p>
                <div className="w-full bg-zinc-700 py-2 rounded-lg text-[10px] font-bold text-white">Generate</div>
            </motion.button>

            {/* Pro Trigger */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onViewInfographic) onViewInfographic(true);
                }}
                className="flex flex-col items-center bg-purple-900/10 border border-purple-500/30 p-4 rounded-2xl backdrop-blur-md hover:bg-purple-900/20 transition-colors"
            >
                <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center mb-3 border border-purple-500/30">
                    <Lock size={18} className="text-purple-400" />
                </div>
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Pro</p>
                <p className="text-[10px] text-zinc-500 mb-3">Nano Banana</p>
                <div className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1">
                     Generate <Sparkles size={10} />
                </div>
            </motion.button>
        </div>

        <button 
            onClick={(e) => {
                e.stopPropagation();
                restart();
            }}
            className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors mx-auto"
        >
            <RotateCcw size={14} /> Replay Story
        </button>

      </motion.div>
    </div>
  );
};

export default CreatorSlide;