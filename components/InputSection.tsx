import React, { useState } from 'react';
import { Copy, Play, CheckCircle2, Clipboard, HelpCircle, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getManualAnalysisPrompt } from '../services/geminiService';
import { WrappedData } from '../types';

interface InputSectionProps {
  onDataReady: (text: string) => void;
  onManualDataReady: (data: WrappedData) => void;
  onDirectInfographic: (data: WrappedData) => void; // New prop for direct access
  isLoading: boolean;
  onShowCaseStudy?: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onManualDataReady, onDirectInfographic, onShowCaseStudy }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'result'>('prompt');
  const [manualInput, setManualInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Get the static prompt that asks the external LLM to estimate stats + generate persona
  const manualPrompt = getManualAnalysisPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(manualPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const parseAndValidate = (): WrappedData | null => {
    const text = manualInput;
    
    // Helper Regex
    const getVal = (key: string, section?: string) => {
        const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : '';
    };

    const getList = (sectionHeader: string) => {
        const sectionIndex = text.indexOf(sectionHeader);
        if (sectionIndex === -1) return [];
        
        // Find end of section (next [HEADER] or end of string)
        const nextSection = text.slice(sectionIndex).search(/\n\[[A-Z]+\]/);
        const sectionContent = nextSection !== -1 
            ? text.slice(sectionIndex, sectionIndex + nextSection) 
            : text.slice(sectionIndex);

        return sectionContent
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.replace('-', '').trim());
    };

    try {
        // --- 1. Parse Stats ---
        const totalMessages = parseInt(getVal('Total Messages').replace(/,/g, '')) || 0;
        const hoursSpent = parseFloat(getVal('Hours Spent')) || 0;
        const mostActiveHour = parseInt(getVal('Most Active Hour')) || 12;
        
        const topWordsRaw = getVal('Top Words');
        const topWords = topWordsRaw.split(',').map(w => {
            const parts = w.trim().split(' '); // simple split, assume "word" or "word: count"
            return { word: parts[0], count: 100 }; // Dummy count if missing
        }).slice(0, 5);

        // --- 2. Parse Persona ---
        const archetype = getVal('Archetype') || "The Mystery Chatter";
        const description = getVal('Description') || "An enigmatic user of AI.";
        const vibeColor = getVal('Vibe Color') || "#888888";
        const powerWord = getVal('Power Word') || "UNKNOWN";
        const soundtrack = getVal('Soundtrack') || "Silence";
        const badge = getVal('Badge') || "Newbie";
        const badgeDesc = getVal('Badge Description') || "Just getting started.";

        // --- 3. Parse Power Skill ---
        const extractBlock = (header: string) => {
             const idx = text.indexOf(header);
             if (idx === -1) return '';
             return text.slice(idx, idx + 500); // 500 chars lookahead
        };
        const powerSkillBlock = extractBlock('[POWER SKILL]');
        const powerSkill = {
            skill: powerSkillBlock.match(/Skill:\s*(.*)/)?.[1] || "Learning",
            description: powerSkillBlock.match(/Description:\s*(.*)/)?.[1] || "You're always learning."
        };

        // --- 4. Parse Lists ---
        const topThemes = getList('[THEMES]');
        const biggestWins = getList('[WINS]');

        // --- 5. Parse Analysis ---
        const thinkingPatterns = getVal('Thinking Patterns');
        const mindsetRoadblocks = getVal('Mindset Roadblocks');

        // --- 6. Parse Complex Fields ---
        const unhingedBlock = extractBlock('[UNHINGED]');
        const unhingedMoment = {
            quote: unhingedBlock.match(/Quote:\s*(.*)/)?.[1] || "N/A",
            context: unhingedBlock.match(/Context:\s*(.*)/)?.[1] || "N/A"
        };

        const mostAskedBlock = extractBlock('[MOST ASKED]');
        const mostAskedQuestion = {
            question: mostAskedBlock.match(/Question:\s*(.*)/)?.[1] || "N/A",
            insight: mostAskedBlock.match(/Insight:\s*(.*)/)?.[1] || "N/A"
        };
        
        const motivationBlock = extractBlock('[MOTIVATION]');
        const finalMotivationalMessage = motivationBlock.match(/Message:\s*(.*)/)?.[1] || "Keep going!";

        // --- 7. Parse Moments ---
        const momentsList = getList('[MOMENTS]'); // Returns strings like "Quote: ... | Reasoning: ..."
        const topMoments = momentsList.map(str => {
            const [quotePart, reasonPart] = str.split('|');
            return {
                quote: quotePart?.replace('Quote:', '').trim() || "Msg",
                reasoning: reasonPart?.replace('Reasoning:', '').trim() || "Good vibe"
            };
        });

        const data: WrappedData = {
            stats: {
                totalMessages,
                userMessageCount: Math.floor(totalMessages / 2),
                aiMessageCount: Math.ceil(totalMessages / 2),
                wordCount: totalMessages * 20, // Estimate
                topWords,
                activeHours: { [mostActiveHour]: 100 },
                mostActiveHour,
                hoursSpent
            },
            persona: {
                archetype,
                description,
                vibeColor,
                powerWord,
                soundtrack,
                topThemes,
                biggestWins,
                thinkingPatterns,
                mindsetRoadblocks,
                unhingedMoment,
                mostAskedQuestion,
                finalMotivationalMessage,
                topMoments,
                chattingStyle: {
                    badge,
                    description: badgeDesc
                },
                powerSkill
            }
        };
        
        if (data.persona.archetype === "The Mystery Chatter" && totalMessages === 0) {
             throw new Error("Could not parse key fields. Please ensure the format matches the prompt output.");
        }

        return data;

    } catch (e: any) {
        console.error("Parse Error:", e);
        alert(`Oops! We couldn't read the report.\n\nError: ${e.message}\n\nMake sure you copied the output starting from [STATS] to the end.`);
        return null;
    }
  };

  const handleProcess = () => {
      const data = parseAndValidate();
      if (data) onManualDataReady(data);
  };

  const handleInstantInfographic = () => {
      const data = parseAndValidate();
      if (data) onDirectInfographic(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
        {/* Simple Tab Navigation */}
        <div className="flex bg-zinc-900/80 p-1 rounded-2xl mb-8 border border-zinc-800 backdrop-blur-sm relative">
            <button 
                onClick={() => setActiveTab('prompt')}
                className={`flex-1 py-4 text-sm md:text-base rounded-xl font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${activeTab === 'prompt' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeTab === 'prompt' ? 'bg-green-500 text-black' : 'bg-zinc-800'}`}>1</span>
                Steal Prompt
            </button>
            <button 
                onClick={() => setActiveTab('result')}
                className={`flex-1 py-4 text-sm md:text-base rounded-xl font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${activeTab === 'result' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeTab === 'result' ? 'bg-green-500 text-black' : 'bg-zinc-800'}`}>2</span>
                Paste Evidence
            </button>
            
            {/* Sliding Background */}
            <motion.div 
                className="absolute top-1 bottom-1 bg-zinc-800 rounded-xl shadow-md"
                initial={false}
                animate={{ 
                    left: activeTab === 'prompt' ? '4px' : '50%', 
                    width: 'calc(50% - 6px)' 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
             {/* Decorative glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <AnimatePresence mode="wait">
                {activeTab === 'prompt' ? (
                    <motion.div 
                        key="prompt"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">The "Truth Serum" Prompt</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Don't just export your data. <strong className="text-white">Interrogate it.</strong> Copy the command below and paste it into ChatGPT, Claude, or Gemini. It forces the AI to reveal your psychological profile.
                            </p>
                        </div>
                        
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                            <textarea 
                                readOnly
                                value={manualPrompt}
                                className="w-full h-48 bg-black/50 border border-zinc-700 rounded-xl p-4 text-zinc-500 text-xs resize-none relative z-10 focus:outline-none focus:border-green-500/50 transition-colors"
                            />
                            <div className="absolute bottom-4 right-4 z-20">
                                <button 
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg ${isCopied ? 'bg-green-500 text-black' : 'bg-white text-black hover:bg-zinc-200'}`}
                                >
                                    {isCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                    {isCopied ? 'STOLEN!' : 'COPY COMMAND'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button 
                                onClick={() => setActiveTab('result')}
                                className="text-zinc-400 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                I have the data. Next Step <Clipboard size={14} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Paste The Evidence</h3>
                            <p className="text-zinc-400 text-sm">
                                Drop the <strong>entire raw report</strong> here. We don't save it. We just turn it into a cinematic experience.
                            </p>
                        </div>

                        <div className="relative mb-6">
                            <textarea
                                className="w-full h-40 bg-black/50 border border-zinc-700 rounded-xl p-4 text-zinc-300 text-xs font-mono resize-none focus:outline-none focus:border-green-500 transition-colors placeholder:text-zinc-700"
                                placeholder={`[STATS]\nTotal Messages: 150\n...\n[PERSONA]\nArchetype: The Visionary\n...`}
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleProcess}
                                disabled={!manualInput.trim()}
                                className="flex-1 bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transform active:scale-95"
                            >
                                <Play size={20} fill="currentColor" /> REVEAL STORY
                            </button>

                            <button
                                onClick={handleInstantInfographic}
                                disabled={!manualInput.trim()}
                                className="flex-1 bg-zinc-800 text-zinc-300 font-bold py-4 rounded-xl hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-zinc-700 hover:text-white active:scale-95"
                            >
                                <Sparkles size={18} /> INSTANT POSTER
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {onShowCaseStudy && (
            <div className="mt-8 text-center">
                <button 
                    onClick={onShowCaseStudy}
                    className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto group"
                >
                    <HelpCircle size={16} className="group-hover:text-green-400 transition-colors" />
                    Wait, how does this work? See Example
                </button>
            </div>
        )}
    </div>
  );
};

export default InputSection;