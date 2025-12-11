import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';
import { Clock } from 'lucide-react';

const StatsSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center p-8 bg-zinc-900 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-600/30 rounded-full blur-[80px]" />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10"
      >
        <h2 className="text-3xl font-bold mb-10">You really like to chat.</h2>
        
        <div className="space-y-10">
          <div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="text-7xl font-black text-white"
            >
                {data.stats.totalMessages.toLocaleString()}
            </motion.div>
            <p className="text-xl text-zinc-400 uppercase tracking-widest font-bold mt-2">Total Messages</p>
          </div>

          <div className="flex gap-8">
              <div className="flex-1">
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                    className="text-4xl font-black text-blue-400"
                >
                    {data.stats.wordCount.toLocaleString()}
                </motion.div>
                 <p className="text-sm text-zinc-400 uppercase tracking-widest font-bold mt-1">Words Typed</p>
              </div>

              <div className="flex-1 border-l border-zinc-700 pl-8">
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
                    className="text-4xl font-black text-green-400 flex items-center gap-2"
                >
                    <Clock size={32} /> {data.stats.hoursSpent.toLocaleString()}
                </motion.div>
                 <p className="text-sm text-zinc-400 uppercase tracking-widest font-bold mt-1">Hours Spent</p>
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsSlide;