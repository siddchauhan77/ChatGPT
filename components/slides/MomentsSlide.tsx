import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';
import { MessageSquareQuote, Star } from 'lucide-react';

const MomentsSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  const moments = data.persona.topMoments || [];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-zinc-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
        
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-6 mt-4"
        >
            <div className="flex items-center gap-2 mb-2 text-amber-500">
                <MessageSquareQuote size={24} />
                <h3 className="text-xs font-bold uppercase tracking-widest">The Highlight Reel</h3>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
                Things you actually<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    typed out loud.
                </span>
            </h2>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center gap-4 relative z-10 pb-8">
            {moments.map((moment, i) => (
                <motion.div 
                    key={i}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ 
                        delay: 0.5 + (i * 0.4), 
                        type: "spring", 
                        stiffness: 70, 
                        damping: 12 
                    }}
                    className="relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                             <div className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                                <Star size={10} className="text-amber-500" fill="currentColor" />
                                {moment.reasoning}
                             </div>
                             <span className="text-zinc-600 font-mono text-[10px]">0{i + 1}</span>
                        </div>
                        
                        <p className="text-white font-medium text-lg leading-snug font-serif italic">
                            "{moment.quote}"
                        </p>
                    </div>
                </motion.div>
            ))}
            
            {moments.length === 0 && (
                <div className="text-center text-zinc-500 italic">
                    (No moments found in your data. Maybe you were too normal?)
                </div>
            )}
        </div>
    </div>
  );
};

export default MomentsSlide;