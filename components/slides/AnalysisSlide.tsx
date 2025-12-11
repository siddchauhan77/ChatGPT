import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';
import { Trophy, Brain, Shuffle } from 'lucide-react';

const AnalysisSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.5 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-gradient-to-b from-zinc-900 to-black overflow-y-auto">
      <motion.h2 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-2xl font-bold text-center mb-6 text-zinc-300 uppercase tracking-widest"
      >
        The Deep Dive
      </motion.h2>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Wins */}
        <motion.div variants={itemVariants} className="bg-green-900/20 border border-green-500/30 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-green-400">
                <Trophy size={20} />
                <h3 className="font-bold uppercase text-sm tracking-wider">Biggest Wins</h3>
            </div>
            <ul className="list-disc list-inside space-y-1">
                {data.persona.biggestWins.map((win, i) => (
                    <li key={i} className="text-zinc-200 text-sm leading-relaxed">{win}</li>
                ))}
            </ul>
        </motion.div>

        {/* Patterns */}
        <motion.div variants={itemVariants} className="bg-blue-900/20 border border-blue-500/30 p-5 rounded-2xl">
             <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Brain size={20} />
                <h3 className="font-bold uppercase text-sm tracking-wider">Thinking Patterns</h3>
            </div>
            <p className="text-zinc-200 text-sm leading-relaxed">
                {data.persona.thinkingPatterns}
            </p>
        </motion.div>

        {/* Roadblocks */}
        <motion.div variants={itemVariants} className="bg-red-900/10 border border-red-500/20 p-5 rounded-2xl">
             <div className="flex items-center gap-2 mb-2 text-red-400">
                <Shuffle size={20} />
                <h3 className="font-bold uppercase text-sm tracking-wider">Mindset Roadblocks</h3>
            </div>
            <p className="text-zinc-200 text-sm leading-relaxed italic opacity-80">
                "{data.persona.mindsetRoadblocks}"
            </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalysisSlide;