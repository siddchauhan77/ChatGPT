import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';
import { HelpCircle } from 'lucide-react';

const ChaoticSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col p-6 bg-zinc-950 relative overflow-hidden justify-center items-center text-center">
        {/* Visual elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[100px]" />
        
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative z-10"
        >
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto text-yellow-500 mb-6 border border-yellow-500/30">
                <HelpCircle size={40} />
            </div>
            
            <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-[0.2em] mb-4">The Obsession</h2>
            
            <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight max-w-sm mx-auto">
                "{data.persona.mostAskedQuestion.question}"
            </h3>
        </motion.div>

        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 max-w-sm relative z-10 backdrop-blur-sm"
        >
            <p className="text-zinc-300 text-sm leading-relaxed italic">
                {data.persona.mostAskedQuestion.insight}
            </p>
        </motion.div>
    </div>
  );
};

export default ChaoticSlide;