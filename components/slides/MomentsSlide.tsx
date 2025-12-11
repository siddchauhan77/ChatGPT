import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';

const MomentsSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col p-6 bg-zinc-950 justify-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-gradient-to-b from-amber-500/20 to-transparent rounded-full blur-[100px]" />
        
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-8"
        >
            <h2 className="text-4xl font-black text-white tracking-tight">The AI said <span className="text-amber-500">what?</span></h2>
            <p className="text-zinc-400 mt-2">Your most memorable exchanges.</p>
        </motion.div>

        <div className="space-y-4 z-10 relative h-[65%] flex flex-col justify-center">
            {data.persona.topMoments.map((moment, i) => (
                <motion.div 
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.4), type: "spring", stiffness: 60, damping: 15 }}
                    className="flex-1"
                >
                    <div className="h-full bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl backdrop-blur-sm hover:bg-zinc-800/40 transition-colors flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/50"></div>
                        
                        <div className="mb-2">
                             <span className="inline-block bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                                {moment.reasoning}
                             </span>
                        </div>

                        <p className="text-white text-lg font-medium leading-snug font-serif opacity-90">
                            "{moment.quote}"
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
  );
};

export default MomentsSlide;