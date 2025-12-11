import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ArrowRight, FileJson, Sparkles } from 'lucide-react';
import { WrappedData } from '../types';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunDemo: (data: WrappedData) => void;
  demoData: WrappedData;
}

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ isOpen, onClose, onRunDemo, demoData }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-colors text-white"
            >
                <X size={20} />
            </button>

            {/* Left: Input (The "Before") */}
            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-zinc-800 bg-black/20 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-zinc-400">
                    <FileJson size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Step 1: The Input</h3>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Paste the JSON</h2>
                <p className="text-sm text-zinc-400 mb-6">
                    You copy the prompt we give you, paste it into your LLM, and it gives you back a JSON block like this.
                </p>

                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl blur-sm" />
                    <pre className="relative bg-black border border-zinc-800 rounded-xl p-4 text-[10px] text-green-400 font-mono overflow-hidden h-64 opacity-80">
{`{
  "stats": {
    "totalMessages": 1420,
    "hoursSpent": 84,
    "topWords": [
      { "word": "debug", "count": 145 },
      { "word": "why", "count": 89 }
    ]
  },
  "persona": {
    "archetype": "The 3AM Debugger",
    "description": "Fueled by caffeine and error logs.",
    "vibeColor": "#ef4444",
    "powerWord": "RESILIENCE",
    ...
  }
}`}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                    </pre>
                </div>
            </div>

            {/* Right: Output (The "After") */}
            <div className="flex-1 p-8 flex flex-col bg-zinc-900 overflow-y-auto">
                 <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <Sparkles size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Step 2: The Result</h3>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Get Your Wrapped</h2>
                <p className="text-sm text-zinc-400 mb-6">
                    We turn that raw data into a full cinematic story about your year in AI.
                </p>

                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800 mb-8 relative overflow-hidden group">
                     {/* Preview Card */}
                     <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     
                     <div className="text-center relative z-10">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-red-500/30">
                            🐛
                        </div>
                        <h3 className="text-xl font-black text-white mb-1">The 3AM Debugger</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Archetype</p>
                        <div className="bg-zinc-900 inline-block px-3 py-1 rounded text-[10px] text-zinc-400 border border-zinc-800">
                            "Most Unhinged: Pasting 4000 lines of error logs"
                        </div>
                     </div>
                </div>

                <button 
                    onClick={() => onRunDemo(demoData)}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg group"
                >
                    <Play size={18} fill="currentColor" /> Play Demo Story <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CaseStudyModal;