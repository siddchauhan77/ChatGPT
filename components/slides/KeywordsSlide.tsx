import React from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../../types';

const KeywordsSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  // Sort and take top 5
  const top5 = data.stats.topWords.slice(0, 5);
  const maxCount = top5[0]?.count || 1;

  return (
    <div className="w-full h-full flex flex-col p-8 bg-black justify-center">
      <h2 className="text-4xl font-black mb-8 text-pink-500">
        You were obsessed with...
      </h2>

      <div className="space-y-4">
        {top5.map((item, index) => (
          <motion.div
            key={item.word}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.2 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
            className="group"
          >
            <div className="flex items-end gap-3 mb-1">
                 <span className="text-2xl font-bold text-white lowercase">#{item.word}</span>
                 <span className="text-sm text-zinc-500 mb-1">{item.count} times</span>
            </div>
           
            <div className="h-6 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-gradient-to-r from-pink-500 to-orange-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxCount) * 100}%` }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 1 }}
                />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KeywordsSlide;
