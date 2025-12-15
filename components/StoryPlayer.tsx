import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WrappedData, SlideType } from '../types';
import { X, Camera } from 'lucide-react';
import html2canvas from 'html2canvas';
import IntroSlide from './slides/IntroSlide';
import StatsSlide from './slides/StatsSlide';
import ThemesSlide from './slides/ThemesSlide';
import AnalysisSlide from './slides/AnalysisSlide';
import ChaoticSlide from './slides/ChaoticSlide';
import RabbitHoleSlide from './slides/RabbitHoleSlide';
import MomentsSlide from './slides/MomentsSlide';
import PersonaSlide from './slides/PersonaSlide';
import SummarySlide from './slides/SummarySlide';
import { playSound } from '../utils/sound';

interface StoryPlayerProps {
  data: WrappedData;
  onClose: () => void;
  onOpenInfographic: () => void;
}

const StoryPlayer: React.FC<StoryPlayerProps> = ({ data, onClose, onOpenInfographic }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Define the slide sequence
  const slides = [
    { component: IntroSlide, duration: 4000, type: SlideType.INTRO },
    { component: StatsSlide, duration: 6000, type: SlideType.STATS_OVERVIEW },
    { component: ThemesSlide, duration: 7000, type: SlideType.THEMES },
    { component: AnalysisSlide, duration: 10000, type: SlideType.ANALYSIS },
    { component: ChaoticSlide, duration: 6000, type: SlideType.CHAOTIC },
    { component: RabbitHoleSlide, duration: 7000, type: SlideType.RABBIT_HOLE },
    { component: MomentsSlide, duration: 8000, type: SlideType.MOMENTS }, // Added new slide
    { component: PersonaSlide, duration: 7000, type: SlideType.PERSONA },
    { component: SummarySlide, duration: 999999, type: SlideType.SUMMARY }, // Final slide stays
  ];

  const CurrentSlideComponent = slides[currentSlideIndex].component;

  // Sound effect on slide change
  useEffect(() => {
    if (currentSlideIndex === 0) {
       playSound('reveal');
    } else {
       playSound('transition');
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      }
    }, slides[currentSlideIndex].duration);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, isPaused, slides.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const restart = () => setCurrentSlideIndex(0);

  const handleSnapshot = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsPaused(true);
      if (slideContainerRef.current) {
          try {
            const canvas = await html2canvas(slideContainerRef.current, {
                backgroundColor: '#09090b',
                scale: 2,
                useCORS: true
            });
            const link = document.createElement('a');
            link.download = `ChatGPT-Wrapped-Slide-${currentSlideIndex + 1}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          } catch (err) {
              console.error("Snapshot failed", err);
          }
      }
      setIsPaused(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-md h-full sm:h-[85vh] sm:rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 border border-zinc-800 flex flex-col">
        
        {/* Progress Bars */}
        <div className="absolute top-4 left-0 right-0 z-20 flex gap-1 px-4">
          {slides.map((slide, index) => (
            <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white relative"
                initial={{ width: index < currentSlideIndex ? "100%" : "0%" }}
                animate={{ 
                  width: index < currentSlideIndex ? "100%" : 
                         index === currentSlideIndex ? "100%" : "0%" 
                }}
                transition={{ 
                  duration: index === currentSlideIndex ? slide.duration / 1000 : 0, 
                  ease: "linear" 
                }}
              >
                {/* Glitch/Scanline effect for active bar */}
                {index === currentSlideIndex && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-transparent w-full h-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Header Controls */}
        <div className="absolute top-8 left-4 right-4 z-20 flex justify-between items-center text-white/60">
          <div className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            ChatGPT Wrapped
          </div>
          <div className="flex gap-3">
             <button 
                onClick={handleSnapshot} 
                className="hover:text-white transition-colors"
                title="Save current slide"
             >
                <Camera size={20} />
             </button>
             <button onClick={onClose} className="hover:text-white transition-colors">
                <X size={24} />
             </button>
          </div>
        </div>

        {/* Slide Content */}
        <div 
          ref={slideContainerRef}
          className="flex-1 relative cursor-pointer overflow-hidden bg-zinc-950"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Tappable Areas for Navigation */}
          <div className="absolute inset-0 flex z-10">
            <div className="w-1/3 h-full" onClick={handlePrev}></div>
            <div className="w-2/3 h-full" onClick={handleNext}></div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex flex-col"
            >
              <CurrentSlideComponent 
                data={data} 
                restart={restart} 
                onOpenInfographic={onOpenInfographic}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;