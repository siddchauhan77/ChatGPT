import React, { useState, useRef } from 'react';
import { WrappedData } from '../types';
import { ArrowLeft, Download, Sparkles, Image as ImageIcon, Loader2, BadgeCheck, Lock, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import { generateInfographicImage } from '../services/geminiService';

interface InfographicProps {
  data: WrappedData;
  onBack: () => void;
}

const Infographic: React.FC<InfographicProps> = ({ data, onBack }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [isProMode, setIsProMode] = useState(true);

  const handleDownload = async () => {
    if (contentRef.current) {
        const canvas = await html2canvas(contentRef.current, {
            backgroundColor: '#09090b',
            scale: 2
        });
        const link = document.createElement('a');
        link.download = `ChatGPT-Wrapped-2025-${data.persona.archetype.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
  };

  const handleGenerateAIImage = async () => {
    setIsGenerating(true);
    try {
        // 1. If Pro Mode (Gemini 3 Pro), Request API Key
        if (isProMode && window.aistudio) {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await window.aistudio.openSelectKey();
                // Check again to be safe
                const hasKeyAfter = await window.aistudio.hasSelectedApiKey();
                if (!hasKeyAfter) {
                    setIsGenerating(false);
                    return;
                }
            }
        }

        // 2. Generate with selected model config
        const imageUrl = await generateInfographicImage(data, isProMode);
        if (imageUrl) {
            setAiImageUrl(imageUrl);
            setShowConfirmation(false); // Close confirmation view
        }
    } catch (e) {
        console.error("Failed to generate poster", e);
        alert("Could not generate image. Please try again or check your API key.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownloadAIImage = () => {
      if (aiImageUrl) {
          const link = document.createElement('a');
          link.download = `Gemini-Poster-2025-${isProMode ? 'Pro' : 'Flash'}.png`;
          link.href = aiImageUrl;
          link.click();
      }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-12 px-4 relative overflow-y-auto">
      <div className="fixed top-6 left-6 z-50 flex gap-2">
        <button 
            onClick={onBack}
            className="bg-white/10 p-3 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors text-white"
        >
            <ArrowLeft size={20} />
        </button>
      </div>

      <div className="fixed top-6 right-6 z-50 flex gap-2">
         <button 
            onClick={handleDownload}
            className="bg-white/10 p-3 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors text-white flex items-center gap-2 px-4 font-medium"
        >
            <Download size={20} /> <span className="hidden sm:inline">Save Summary</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl">
        
        {/* Main Stats Column */}
        <div className="flex flex-col items-center w-full lg:w-auto">
            <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-4 font-bold">Data Summary</h2>
            <div ref={contentRef} id="infographic-content" className="w-full max-w-md bg-zinc-900 text-white p-8 rounded-3xl shadow-2xl border border-zinc-800">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        ChatGPT Wrapped
                    </h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest">Year-End Analyst Report</p>
                </div>

                {/* Persona Card */}
                <div 
                    className="mb-8 p-6 rounded-2xl relative overflow-hidden"
                    style={{ backgroundColor: data.persona.vibeColor }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 border border-white/30">
                        <BadgeCheck size={12} /> {data.persona.chattingStyle.badge}
                    </div>

                    <div className="relative z-10 text-center mt-4">
                        <div className="text-4xl mb-3">🎴</div>
                        <h2 className="text-2xl font-black mb-1 leading-none">{data.persona.archetype}</h2>
                        <p className="text-sm font-medium opacity-90">{data.persona.description}</p>
                    </div>
                </div>

                {/* Top 5 Themes */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Top 5 Themes</h3>
                    <div className="space-y-2">
                        {data.persona.topThemes.slice(0, 5).map((theme, i) => (
                            <div key={i} className="flex items-center gap-3 bg-black/20 p-2 rounded-lg">
                                <span className="font-mono text-zinc-500 text-sm">0{i+1}</span>
                                <span className="font-bold text-sm">{theme}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wins & Roadblocks */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                    <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                        <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Biggest Wins</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {data.persona.biggestWins.slice(0,3).map((win, i) => (
                                <li key={i} className="text-xs text-zinc-300">{win}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl">
                        <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Mindset Roadblocks</h3>
                        <p className="text-xs text-zinc-300 italic">"{data.persona.mindsetRoadblocks}"</p>
                    </div>
                </div>

                {/* Highlight Stats */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-zinc-800/50 p-3 rounded-xl text-center">
                        <p className="text-2xl font-black">{data.stats.totalMessages}</p>
                        <p className="text-[10px] text-zinc-500 uppercase">Messages</p>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-xl text-center">
                        <p className="text-2xl font-black">{data.stats.mostActiveHour}:00</p>
                        <p className="text-[10px] text-zinc-500 uppercase">Peak Hour</p>
                    </div>
                </div>

                {/* Unhinged Moment */}
                <div className="mb-8 bg-gradient-to-r from-pink-900/20 to-purple-900/20 p-5 rounded-xl border border-pink-500/20">
                    <p className="text-pink-500 text-[10px] font-bold uppercase mb-2">Most Unhinged Moment</p>
                    <p className="italic text-sm text-zinc-200 font-serif leading-relaxed">"{data.persona.unhingedMoment.quote}"</p>
                </div>

                {/* Motivational Message */}
                <div className="mb-8 text-center px-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">2025 Manifesto</p>
                    <p className="text-lg font-bold text-white leading-tight">"{data.persona.finalMotivationalMessage}"</p>
                </div>

                {/* Footer */}
                <div className="text-center pt-6 border-t border-zinc-800">
                    <p className="text-2xl font-black mb-1">{data.persona.powerWord}</p>
                    <p className="text-[10px] text-zinc-600 uppercase">Your 2025 Power Word</p>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 text-zinc-700 text-[10px]">
                        <span>ChatGPT Wrapped</span>
                    </div>
                </div>
            </div>
        </div>

        {/* AI Poster Column */}
        <div className="flex flex-col items-center w-full max-w-md">
            <h2 className="text-purple-400 text-sm uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                <Sparkles size={16} /> AI Poster Generator
            </h2>
            
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[600px] shadow-2xl relative overflow-hidden transition-all">
                {/* Top Toggle */}
                {!aiImageUrl && (
                     <div className="absolute top-6 left-0 right-0 flex justify-center z-20">
                        <div className="bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/10 flex gap-1">
                            <button 
                                onClick={() => setIsProMode(false)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${!isProMode ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Zap size={12} /> Flash (Fast)
                            </button>
                            <button 
                                onClick={() => setIsProMode(true)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isProMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Sparkles size={12} /> Pro (HD)
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                
                {!aiImageUrl ? (
                    !showConfirmation ? (
                        <div className="text-center mt-12">
                            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ImageIcon className="text-zinc-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Create Your Poster</h3>
                            <p className="text-zinc-400 text-sm mb-8 px-4 leading-relaxed">
                                {isProMode 
                                    ? "Unlock vivid visuals and 1K resolution using Gemini 3 Pro (Nano Banana Pro). Requires API Key." 
                                    : "Generate a quick, stylized poster using Gemini Flash Image. Fast and free."}
                            </p>
                            <button 
                                onClick={() => setShowConfirmation(true)}
                                className={`font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 flex items-center gap-2 mx-auto ${isProMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                            >
                                <Sparkles size={18} /> {isProMode ? "Create Pro Poster" : "Create Flash Poster"}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center p-4 mt-8 w-full">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${isProMode ? 'bg-purple-900/30 border-purple-500/30' : 'bg-zinc-800 border-zinc-600'}`}>
                                {isProMode ? <Lock className="text-purple-400" size={24} /> : <Zap className="text-zinc-400" size={24} />}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{isProMode ? "Unlock Pro Quality" : "Ready to Generate?"}</h3>
                            <p className="text-zinc-300 text-sm mb-6">
                                {isProMode 
                                    ? <span>You are about to use <strong>Gemini 3 Pro</strong>. You will be asked to connect a valid API key.</span>
                                    : <span>Generating with <strong>Gemini Flash</strong>. Quick and simple.</span>
                                }
                            </p>
                            
                            <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 text-left">
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Output Details:</p>
                                <ul className="text-xs text-zinc-300 space-y-2">
                                    <li>• Model: <span className="text-white">{isProMode ? 'Gemini 3 Pro (Nano Banana Pro)' : 'Gemini 2.5 Flash Image'}</span></li>
                                    <li>• Quality: <span className="text-white">{isProMode ? '1K High Fidelity' : 'Standard'}</span></li>
                                    <li>• Style: <span className="text-white">Rich Visual Metaphors</span></li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleGenerateAIImage}
                                    disabled={isGenerating}
                                    className={`w-full text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${isProMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                                >
                                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : (isProMode ? "Connect Key & Generate" : "Generate Poster")}
                                </button>
                                <button 
                                    onClick={() => setShowConfirmation(false)}
                                    disabled={isGenerating}
                                    className="text-zinc-500 hover:text-zinc-300 text-sm py-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center w-full h-full animate-in fade-in duration-500 pt-8">
                         <div className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest flex items-center gap-2">
                            {isProMode ? <Sparkles size={10} className="text-purple-400" /> : <Zap size={10} />}
                            Generated with {isProMode ? 'Gemini Pro' : 'Gemini Flash'}
                         </div>
                        <img src={aiImageUrl} alt="AI Generated Poster" className="w-full h-auto rounded-lg shadow-lg mb-6 border border-zinc-700" />
                        <div className="flex gap-3">
                             <button 
                                onClick={handleDownloadAIImage}
                                className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2"
                                title="Download the AI-generated poster"
                            >
                                <Download size={18} /> Save Poster
                            </button>
                            <button 
                                onClick={() => setAiImageUrl(null)}
                                className="bg-zinc-800 text-white font-medium py-2 px-6 rounded-full hover:bg-zinc-700 transition-colors"
                            >
                                New
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Infographic;