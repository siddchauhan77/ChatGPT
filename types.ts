export interface ChatStats {
  totalMessages: number;
  userMessageCount: number;
  aiMessageCount: number;
  wordCount: number;
  topWords: Array<{ word: string; count: number }>;
  activeHours: Record<string, number>; // "00" to "23" -> count
  mostActiveHour: number;
  hoursSpent: number;
}

export enum SlideType {
  INTRO = 'INTRO',
  STATS_OVERVIEW = 'STATS_OVERVIEW',
  THEMES = 'THEMES',
  ANALYSIS = 'ANALYSIS',
  CHAOTIC = 'CHAOTIC',
  RABBIT_HOLE = 'RABBIT_HOLE',
  PERSONA = 'PERSONA',
  SUMMARY = 'SUMMARY',
  CREATOR = 'CREATOR',
}

export interface WrappedPersona {
  archetype: string; // e.g. "The Code Wizard"
  description: string;
  vibeColor: string; // Hex code
  powerWord: string; 
  soundtrack: string; 
  
  // New specific fields from the prompt
  topThemes: string[]; // 1. Top 5 themes
  biggestWins: string[]; // 2. Biggest wins + real progress
  thinkingPatterns: string; // 3. Patterns in questions
  mindsetRoadblocks: string; // 4. Mindset roadblocks
  unhingedMoment: { quote: string; context: string }; // 5. Most 'unhinged' thing
  mostAskedQuestion: { question: string; insight: string }; // 6. Question asked the most + what it says about them
  finalMotivationalMessage: string; // 7. Final motivational message
  topMoments: Array<{ quote: string; reasoning: string }>;
  chattingStyle: { badge: string; description: string };
  powerSkill: { skill: string; description: string };
}

export interface WrappedData {
  stats: ChatStats;
  persona: WrappedPersona;
}

// Global augmentation for AI Studio
declare global {
  // We augment the existing AIStudio interface which is already declared on Window in the environment.
  // This avoids conflicting with the existing Window.aistudio declaration.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}