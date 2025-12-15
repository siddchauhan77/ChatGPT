import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles, Database } from 'lucide-react';
import { WrappedData } from '../types';

interface WrappedPreviewProps {
  data: WrappedData;
  onPlay: () => void;
  onOpenInfographic: () => void;
}

const WrappedPreview: React.FC<WrappedPreviewProps> = ({ data, onPlay, onOpenInfographic }) => {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex items-center justify-center">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]"
        >
            {/* Left: The Data (Input) */}
            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-zinc-800 bg-black/20 flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 mb-6 text-zinc-400">
                    <Database size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-widest">The Raw Truth</h3>
                </div>
                
                <h2 className="text-3xl font-black text-white mb-2">Analysis Complete.</h2>
                <p className="text-sm text-zinc-400 mb-8">
                    We've dissected your chat history. The patterns are undeniable.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                        <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Total Messages</p>
                        <p className="text-2xl font-mono text-white">{data.stats.totalMessages.toLocaleString()}</p>
                     </div>
                     <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                        <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Hours Spent</p>
                        <p className="text-2xl font-mono text-green-400">{data.stats.hoursSpent.toLocaleString()}</p>
                     </div>
                     <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 col-span-2">
                        <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Top Keywords</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {data.stats.topWords.slice(0, 5).map((w, i) => (
                                <span key={i} className="text-xs bg-zinc-900 px-2 py-1 rounded text-zinc-300 border border-zinc-700">
                                    #{w.word}
                                </span>
                            ))}
                        </div>
                     </div>
                </div>

                <div className="flex-1 relative group overflow-hidden rounded-xl border border-zinc-800 bg-black">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
                    <div className="p-4 font-mono text-[10px] text-zinc-500 overflow-hidden opacity-70">
                        {JSON.stringify(data.persona, null, 2)}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>
            </div>

            {/* Right: The Result (Persona) */}
            <div className="flex-1 p-8 flex flex-col bg-zinc-900 overflow-hidden relative">
                 <div className="flex items-center gap-2 mb-6 text-purple-400">
                    <Sparkles size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Your AI Identity</h3>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-full max-w-sm aspect-[3/4] bg-zinc-950 rounded-2xl border border-zinc-800 p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group"
                    >
                        <div 
                            className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-30"
                            style={{ backgroundColor: data.persona.vibeColor }}
                        />
                        <div className="absolute top-0 right-0 p-4">
                             <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                 <p className="text-[10px] font-bold text-white uppercase tracking-wider">{data.persona.chattingStyle.badge}</p>
                             </div>
                        </div>

                        <div className="text-6xl mb-6">🎴</div>
                        <h2 className="text-3xl font-black text-white mb-2 leading-none">{data.persona.archetype}</h2>
                        <div className="w-12 h-1 bg-white/20 rounded-full mb-4" />
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                            {data.persona.description}
                        </p>

                        <div className="mt-8 pt-6 border-t border-white/5 w-full">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Power Word</p>
                            <p className="text-xl font-bold text-white">{data.persona.powerWord}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-8 relative z-20 flex flex-col gap-3">
                    <button 
                        onClick={onPlay}
                        className="w-full bg-white text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Play size={20} fill="currentColor" /> 
                        <span className="text-lg">Reveal My Story</span> 
                        <ArrowRight size={20} />
                    </button>
                    
                    <button 
                        onClick={onOpenInfographic}
                        className="w-full bg-zinc-800 text-zinc-300 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors text-sm"
                    >
                        <Sparkles size={16} /> Instant AI Poster
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
  );
};

export default WrappedPreview;