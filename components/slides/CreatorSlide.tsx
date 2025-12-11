import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';
import { Sparkles, ImageIcon, Zap, Lock, RotateCcw } from 'lucide-react';

interface CreatorSlideProps {
  data: WrappedData;
  restart: () => void;
  onViewInfographic?: () => void;
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

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md mb-8">
            <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Zap size={18} className="text-yellow-400" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-300 uppercase">Flash</p>
                    <p className="text-[9px] text-zinc-500">Free & Fast</p>
                </div>
                <div className="h-8 w-px bg-zinc-700"></div>
                <div className="text-center">
                    <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-500/30">
                        <Lock size={18} className="text-purple-400" />
                    </div>
                    <p className="text-[10px] font-bold text-purple-300 uppercase">Pro</p>
                    <p className="text-[9px] text-zinc-500">Nano Banana</p>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onViewInfographic) onViewInfographic();
                }}
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-white/10 group"
            >
                <Sparkles size={18} className="group-hover:text-purple-600 transition-colors" /> 
                Enter Creator Studio
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