import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';
import { BadgeCheck, Zap } from 'lucide-react';

const PersonaSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div 
        className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
        style={{ backgroundColor: data.persona.vibeColor }}
    >
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 w-full max-w-sm">
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold uppercase tracking-widest mb-4 opacity-80"
        >
            Your AI Personality
        </motion.p>
        
        <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mb-8"
        >
            {/* Visual Placeholder for Persona Card */}
            <div className="w-full bg-black/40 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-6 flex flex-col justify-between transform rotate-[-3deg] shadow-2xl mx-auto relative overflow-hidden">
                 
                 {/* Chatting Style Badge */}
                 <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <BadgeCheck size={12} /> {data.persona.chattingStyle.badge}
                 </div>

                 <div className="text-6xl text-left mt-4">🎴</div>
                 <div className="mt-4 text-left">
                    <h1 className="text-3xl font-black text-white leading-tight mb-2">
                        {data.persona.archetype}
                    </h1>
                    <div className="h-1 w-20 bg-white/50 mb-4"></div>
                    <p className="text-sm text-white/80 font-medium leading-snug">
                        {data.persona.description}
                    </p>
                 </div>
            </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/20 p-3 rounded-xl backdrop-blur-sm"
            >
                <p className="text-white/60 text-[10px] font-semibold uppercase">Power Word</p>
                <p className="text-xl font-black text-white tracking-tighter">{data.persona.powerWord}</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="bg-black/20 p-3 rounded-xl backdrop-blur-sm"
            >
                <p className="text-white/60 text-[10px] font-semibold uppercase">Chatting Style</p>
                <p className="text-sm font-bold text-white leading-tight">{data.persona.chattingStyle.badge}</p>
                <p className="text-[9px] text-white/70 leading-tight mt-1 truncate">{data.persona.chattingStyle.description}</p>
            </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-black/20 p-3 rounded-xl backdrop-blur-sm flex items-center gap-3 text-left"
        >
            <div className="bg-white/10 p-2 rounded-lg">
                <Zap size={20} className="text-yellow-400" />
            </div>
            <div>
                <p className="text-white/60 text-[10px] font-semibold uppercase">Power Skill</p>
                <p className="text-sm font-bold text-white leading-tight">{data.persona.powerSkill.skill}</p>
                <p className="text-[10px] text-white/70 leading-tight mt-0.5">{data.persona.powerSkill.description}</p>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonaSlide;