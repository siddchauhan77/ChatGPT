import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WrappedData } from '../../types';
import { Quote, Download, ChevronUp } from 'lucide-react';
import html2canvas from 'html2canvas';

interface SummaryProps {
    data: WrappedData;
    restart: () => void;
    onOpenInfographic?: () => void;
}

const SummarySlide: React.FC<SummaryProps> = ({ data, onOpenInfographic }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const handleDownloadCard = async (format: 'png' | 'jpeg', scale: number) => {
    setShowDownloadOptions(false);
    if (cardRef.current) {
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: scale,
                useCORS: true,
                logging: false
            });
            const link = document.createElement('a');
            link.download = `Manifesto-${data.persona.archetype.replace(/\s+/g, '-')}-${scale}x.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : 1.0);
            link.click();
        } catch (e) {
            console.error("Save card failed:", e);
            alert("Could not save the card. Please try taking a screenshot manually.");
        }
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-zinc-900 relative overflow-hidden">
      
      <div className="flex-1 flex flex-col justify-center relative z-10 mb-4">
        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 text-center">Your 2025 Manifesto</h2>
        
        <motion.div 
            ref={cardRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-800 p-8 rounded-3xl shadow-2xl text-center relative"
        >
            <Quote className="absolute top-6 left-6 text-white/20" size={48} />
            
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed italic mb-6 relative z-10">
                "{data.persona.finalMotivationalMessage}"
            </p>
            
            <div className="w-16 h-1 bg-white/30 mx-auto rounded-full mb-4"></div>
            
            <p className="text-white/70 text-sm font-medium">
                — Your Personal Year-End Analyst
            </p>

             <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/60 text-xs font-semibold uppercase mb-1">Archetype</p>
                <h1 className="text-2xl font-black text-white">{data.persona.archetype}</h1>
            </div>
        </motion.div>
      </div>

      <div className="space-y-3 mt-auto relative z-20 max-w-sm mx-auto w-full">
         <div className="flex gap-2 justify-center">
             <div className="relative w-full">
                 <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors text-sm border border-zinc-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDownloadOptions(!showDownloadOptions);
                    }}
                >
                    <Download size={16} /> Save Card <ChevronUp size={14} className={`transition-transform ${showDownloadOptions ? 'rotate-180' : ''}`} />
                 </motion.button>
                
                {/* Download Options Menu */}
                <AnimatePresence>
                    {showDownloadOptions && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-30"
                        >
                            <div className="p-2 space-y-1">
                                <button onClick={() => handleDownloadCard('png', 2)} className="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded-lg text-xs text-white">PNG High Res (2x)</button>
                                <button onClick={() => handleDownloadCard('png', 1)} className="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300">PNG Standard</button>
                                <button onClick={() => handleDownloadCard('jpeg', 2)} className="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300">JPG High Res</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
         </div>
      </div>
    </div>
  );
};

export default SummarySlide;