import React, { useState } from 'react';
import { analyzeChatData } from './services/analyzer';
import { generateWrappedPersona } from './services/geminiService';
import { WrappedData } from './types';
import InputSection from './components/InputSection';
import StoryPlayer from './components/StoryPlayer';
import Infographic from './components/Infographic';
import CaseStudyModal from './components/CaseStudyModal';
import WrappedPreview from './components/WrappedPreview';
import { playSound } from './utils/sound';

const CASE_STUDY_DATA: WrappedData = {
  stats: {
    totalMessages: 2453,
    userMessageCount: 1200,
    aiMessageCount: 1253,
    wordCount: 145020,
    topWords: [
      { word: "debug", count: 342 },
      { word: "fix", count: 210 },
      { word: "why", count: 189 },
      { word: "regex", count: 140 },
      { word: "coffee", count: 90 }
    ],
    activeHours: { "02": 300, "03": 450, "14": 100 },
    mostActiveHour: 3,
    hoursSpent: 124.5
  },
  persona: {
    archetype: "The 3AM Debugger",
    description: "You live in the console logs and thrive on chaos. Your best work happens when normal people are asleep.",
    vibeColor: "#ef4444",
    powerWord: "RESILIENCE",
    soundtrack: "lofi hip hop beats to panic/code to",
    topThemes: ["Syntax Errors", "Existential Dread", "Regular Expressions", "System Architecture", "Rubber Ducking"],
    biggestWins: [
      "Fixed that race condition in production",
      "Finally understood useEffect dependencies",
      "Survived the migration to TypeScript"
    ],
    thinkingPatterns: "You spiral into detail immediately. You often paste code before explaining the problem.",
    mindsetRoadblocks: "Perfectionism. You try to optimize things that don't work yet.",
    unhingedMoment: {
      quote: "Please just tell me if I'm stupid or if the compiler is lying.",
      context: "After 4 hours of debugging a missing semicolon."
    },
    mostAskedQuestion: {
      question: "Why is this returning undefined?",
      insight: "You trust logic, but logic often betrays you."
    },
    finalMotivationalMessage: "The code compiles, and so do you. Keep pushing, builder.",
    topMoments: [
      { quote: "I can't fix your sleep schedule, but I can fix this loop.", reasoning: "Sassy AI" },
      { quote: "Have you tried turning it off and on again?", reasoning: "Classic Advice" },
      { quote: "That is not a valid Python function.", reasoning: "Reality Check" }
    ],
    chattingStyle: {
      badge: "The Night Owl",
      description: "Active mostly between 12AM and 4AM."
    },
    powerSkill: {
      skill: "Root Cause Analysis",
      description: "You stopped guessing and started dissecting errors with surgical precision."
    }
  }
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null);
  const [viewMode, setViewMode] = useState<'input' | 'preview' | 'story'>('input');
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const [showInfographic, setShowInfographic] = useState(false);

  const processData = async (input: string) => {
    setIsLoading(true);
    playSound('click');
    try {
      // 1. Client side heavy lifting (Stats)
      const { stats, sampleText } = await analyzeChatData(input);
      
      // 2. AI Creative Layer (Persona)
      if (stats.totalMessages < 2 && stats.wordCount < 10) {
        alert("Not enough data to analyze! Try pasting a longer conversation.");
        setIsLoading(false);
        return;
      }

      const persona = await generateWrappedPersona(stats, sampleText);
      
      setWrappedData({ stats, persona });
      setViewMode('preview'); // Go to preview first
      playSound('reveal');
    } catch (error) {
      console.error(error);
      alert("Something went wrong analyzing your chats. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualData = (data: WrappedData) => {
      setWrappedData(data);
      setViewMode('preview'); // Go to preview first
      playSound('reveal');
  };

  // New handler for the 3rd button
  const handleDirectInfographic = (data: WrappedData) => {
      setWrappedData(data);
      setViewMode('preview'); // Set background to preview
      setShowInfographic(true); // Open modal immediately
      playSound('reveal');
  };

  const handleCaseStudyRun = (data: WrappedData) => {
      setShowCaseStudy(false);
      handleManualData(data);
  };

  const startStory = () => {
      playSound('click');
      setViewMode('story');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black font-sans relative">
      
      {showInfographic && wrappedData && (
        <div className="fixed inset-0 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-300 bg-zinc-950">
             <Infographic 
                data={wrappedData} 
                onBack={() => setShowInfographic(false)}
            />
        </div>
      )}

      {viewMode === 'preview' && wrappedData && (
        <WrappedPreview 
            data={wrappedData} 
            onPlay={startStory}
            onOpenInfographic={() => setShowInfographic(true)}
        />
      )}

      {viewMode === 'story' && wrappedData && (
        <StoryPlayer 
            data={wrappedData} 
            onClose={() => setViewMode('preview')}
            onOpenInfographic={() => setShowInfographic(true)}
        />
      )}

      {viewMode === 'input' && (
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-12">
                <div className="inline-block p-3 bg-zinc-800 rounded-2xl mb-6 shadow-2xl shadow-green-900/20 transform hover:scale-105 transition-transform duration-300">
                    <span className="text-5xl">🤖 🎁</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                    ChatGPT<br/>Wrapped
                </h1>
                <p className="text-xl text-zinc-400 max-w-md mx-auto">
                    The AI knows you better than you know yourself.<br/>
                    <span className="text-white font-bold">Time to see the proof.</span>
                </p>
            </div>

            <InputSection 
                onDataReady={processData} 
                onManualDataReady={handleManualData} 
                onDirectInfographic={handleDirectInfographic}
                isLoading={isLoading} 
                onShowCaseStudy={() => setShowCaseStudy(true)}
            />
            
            <footer className="mt-20 text-zinc-600 text-sm">
                Built with Gemini 2.5 Flash & React. Not affiliated with OpenAI.
            </footer>
        </div>
      )}

      <CaseStudyModal 
        isOpen={showCaseStudy} 
        onClose={() => setShowCaseStudy(false)} 
        onRunDemo={handleCaseStudyRun}
        demoData={CASE_STUDY_DATA}
      />
    </div>
  );
};

export default App;