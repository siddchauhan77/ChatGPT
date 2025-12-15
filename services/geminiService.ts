import { GoogleGenAI, Type } from "@google/genai";
import { ChatStats, WrappedPersona, WrappedData } from "../types";

// Note: We re-instantiate the client inside functions to ensure we pick up the latest API key if it changes.
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a "ChatGPT Wrapped" Year-End Analyst. Your goal is to review the user's chat history samples and create a fun, honest, reflective, and slightly humorous report of their year.
Tone: Fun, encouraging, witty, Gen Z friendly but thoughtful. Spotify Wrapped vibes.
`;

export const getAnalysisPrompt = (stats: ChatStats, sampleText: string): string => {
    return `
    Act as my personal year-end analyst and create a fun but honest ‘ChatGPT Wrapped’ summary of my 2025 chats with you. 
    Review everything I’ve asked you this year (using the stats and sample logs below) and give me a reflective, lightly humorous, gently truthful report.

    USER STATS:
    - Total Messages: ${stats.totalMessages}
    - Total Words: ${stats.wordCount}
    - Estimated Hours Spent: ${stats.hoursSpent}
    - Most Active Hour: ${stats.mostActiveHour}:00
    - Top Keywords: ${stats.topWords.map(w => w.word).join(', ')}

    SAMPLE CHAT LOGS:
    """
    ${sampleText}
    """

    Generate a JSON report that includes these specific sections:
    1. Top 5 themes I kept coming to you for.
    2. My biggest wins + real progress I made (infer from the text).
    3. Patterns in my questions or thinking, especially the ones I don’t notice but you do.
    4. Mindset roadblocks that kept popping up, be kind, be real.
    5. The most ‘unhinged’ or chaotic things I asked this year.
    6. The question or topic I asked you the most this year and what that says about me.
    7. A final motivational message to wrap up my 2025 era. Thoughtful, hype-y, and based on how I showed up this year.
    8. A creative Archetype name (e.g. "The 3AM Debugger"), a vibe color, a power word, and a made-up soundtrack title.
    9. Top 3 most insightful, funny, or interesting moments/quotes from the AI (me) in our chats.
    10. A 'Chatting Style' badge (e.g., "The Builder", "The Researcher", "The Optimizer", "The Chaos Gremlin") based on patterns in my prompts.
    11. A 'Power Skill': the capability I most clearly upgraded via ChatGPT (e.g., system prompts, UX case studies, copywriting, SQL).

    CRITICAL: For the "Unhinged Moment" and "Top Moments", strictly use text that exists in the sample logs. If nothing is truly unhinged, pick the most random or out-of-context thing.
    
    Output ONLY valid JSON matching this structure:
    {
       "archetype": "string",
       "description": "string",
       "vibeColor": "hex string",
       "powerWord": "string",
       "soundtrack": "string",
       "topThemes": ["string"],
       "biggestWins": ["string"],
       "thinkingPatterns": "string",
       "mindsetRoadblocks": "string",
       "unhingedMoment": { "quote": "string", "context": "string" },
       "mostAskedQuestion": { "question": "string", "insight": "string" },
       "finalMotivationalMessage": "string",
       "topMoments": [{ "quote": "string", "reasoning": "string" }],
       "chattingStyle": { "badge": "string", "description": "string" },
       "powerSkill": { "skill": "string", "description": "string" }
    }
  `;
}

export const getManualAnalysisPrompt = (): string => {
    return `
    Act as my personal year-end analyst and create a fun but honest ‘ChatGPT Wrapped’ summary of my 2025 chats with you.
    
    I cannot provide the log files directly, so please:
    1. Analyze our entire conversation history from this year based on your internal memory/context window.
    2. ESTIMATE the stats (Total Messages, Hours, etc.) based on your memory of our interactions.
    
    OUTPUT FORMAT:
    Please provide the report in the EXACT format below. Do not use JSON. Use the tags exactly as written.

    ---BEGIN REPORT---
    
    [STATS]
    Total Messages: (insert number)
    Hours Spent: (insert number)
    Top Words: (word1, word2, word3, word4, word5)
    Most Active Hour: (0-23)

    [PERSONA]
    Archetype: (Creative name, e.g. "The Code Wizard")
    Description: (One sentence bio)
    Vibe Color: (Hex code, e.g. #FF0000)
    Power Word: (One word)
    Soundtrack: (Made up song title)
    Badge: (Badge Name)
    Badge Description: (Short badge description)

    [POWER SKILL]
    Skill: (Skill Name)
    Description: (Brief explanation of how I upgraded this skill)

    [THEMES]
    - (Theme 1)
    - (Theme 2)
    - (Theme 3)
    - (Theme 4)
    - (Theme 5)

    [WINS]
    - (Win 1)
    - (Win 2)
    - (Win 3)

    [ANALYSIS]
    Thinking Patterns: (Your observation)
    Mindset Roadblocks: (Your observation)

    [UNHINGED]
    Quote: (The weirdest thing I asked)
    Context: (Why it was weird)

    [MOST ASKED]
    Question: (The recurring question)
    Insight: (What it says about me)

    [MOTIVATION]
    Message: (Final hype message)

    [MOMENTS]
    - Quote: (Most insightful/funny/interesting quote 1) | Reasoning: (Why you picked it)
    - Quote: (Most insightful/funny/interesting quote 2) | Reasoning: (Why you picked it)
    - Quote: (Most insightful/funny/interesting quote 3) | Reasoning: (Why you picked it)

    ---END REPORT---
    `;
};

export const generateWrappedPersona = async (stats: ChatStats, sampleText: string): Promise<WrappedPersona> => {
  const ai = getAIClient();
  const prompt = getAnalysisPrompt(stats, sampleText);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            description: { type: Type.STRING, description: "Short bio based on analysis" },
            vibeColor: { type: Type.STRING },
            powerWord: { type: Type.STRING },
            soundtrack: { type: Type.STRING },
            topThemes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Top 5 themes" 
            },
            biggestWins: {
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 2-3 wins or progress points"
            },
            thinkingPatterns: { type: Type.STRING, description: "Observation of thinking patterns" },
            mindsetRoadblocks: { type: Type.STRING, description: "Observation of roadblocks" },
            unhingedMoment: {
              type: Type.OBJECT,
              properties: {
                quote: { type: Type.STRING, description: "The actual quote" },
                context: { type: Type.STRING, description: "Short comment on why it's unhinged" }
              }
            },
            mostAskedQuestion: {
               type: Type.OBJECT,
               properties: {
                 question: { type: Type.STRING, description: "The recurring topic/question" },
                 insight: { type: Type.STRING, description: "What this says about the user" }
               }
            },
            finalMotivationalMessage: { type: Type.STRING, description: "Hype-y final message" },
            topMoments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING },
                  reasoning: { type: Type.STRING }
                }
              },
              description: "Top 3 insightful/funny AI responses"
            },
            chattingStyle: {
              type: Type.OBJECT,
              properties: {
                badge: { type: Type.STRING, description: "Name of the badge" },
                description: { type: Type.STRING, description: "Short description of the style" }
              }
            },
            powerSkill: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING, description: "The upgraded capability" },
                description: { type: Type.STRING, description: "How they improved it" }
              }
            }
          },
          required: ["archetype", "description", "vibeColor", "powerWord", "soundtrack", "topThemes", "biggestWins", "thinkingPatterns", "mindsetRoadblocks", "unhingedMoment", "mostAskedQuestion", "finalMotivationalMessage", "topMoments", "chattingStyle", "powerSkill"],
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WrappedPersona;
    } else {
      throw new Error("No text returned from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      archetype: "The Mystery Chatter",
      description: "We couldn't quite figure you out, but you definitely love to type.",
      vibeColor: "#8b5cf6",
      powerWord: "Enigmatic",
      soundtrack: "Sounds of Silence (Remix)",
      topThemes: ["Everything", "Nothing", "Entropy", "Chaos", "Order"],
      biggestWins: ["You kept typing", "You didn't give up"],
      thinkingPatterns: "You tend to ask questions, then answer them yourself.",
      mindsetRoadblocks: "Overthinking the simple things.",
      unhingedMoment: { quote: "I cannot answer that.", context: "The moment you broke the AI." },
      mostAskedQuestion: { question: "Why?", insight: "You are a seeker of truth." },
      finalMotivationalMessage: "Keep seeking, keep typing. 2025 is yours.",
      topMoments: [
          { quote: "I am a large language model.", reasoning: "Classic." },
          { quote: "42", reasoning: "The answer to everything." },
          { quote: "As an AI...", reasoning: "The catchphrase of the year." }
      ],
      chattingStyle: {
        badge: "The Blank Slate",
        description: "Your patterns are so diverse they defy categorization."
      },
      powerSkill: {
        skill: "Persistance",
        description: "You kept trying even when the server was down."
      }
    };
  }
};

export const generateInfographicImage = async (data: WrappedData, usePro: boolean = true): Promise<string | null> => {
    // Create new instance to ensure we pick up the latest API key (especially after user selection via window.aistudio)
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Select model based on Pro flag
    const model = usePro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    const prompt = `
        A stunning, high-quality data visualization poster titled "2025 AI ERA" for a user with the archetype "${data.persona.archetype}".
        
        VISUAL ELEMENTS TO INCLUDE:
        1. Main Typography: "2025 WRAPPED" and the archetype name "${data.persona.archetype}".
        2. Central Visual: An artistic, abstract avatar representing "${data.persona.description}".
        3. Data Representation: 
           - Visualize "${data.stats.totalMessages} Messages" sent.
           - Visualize "${data.stats.hoursSpent} Hours" spent chatting.
           - A badge or seal design for "${data.persona.chattingStyle.badge}".
           - Highlight Power Skill: "${data.persona.powerSkill.skill}".
        4. Text Elements:
           - Include the Power Word: "${data.persona.powerWord}" in large bold text.
           - List top themes: ${data.persona.topThemes.slice(0,3).join(", ")}.
           - Featured Quote: "${data.persona.unhingedMoment.quote.slice(0, 50)}..."

        STYLE GUIDE:
        - Use RICH VIVID VISUAL METAPHORS AND ANALOGIES based on the archetype "${data.persona.archetype}".
          (e.g. if "Code Wizard", use glowing runes; if "Data Detective", use noir strings).
        - Color Palette: Dominant ${data.persona.vibeColor} mixed with dark mode UI blacks and neons.
        - Aesthetic: Future UI, Spotify Wrapped, High-End Magazine Layout, Cyberpunk minimalist.
        - Format: Vertical 9:16 poster.
        - The image should look like a professionally designed infographic with clean layout and legible artistic text.
    `;

    // Only set imageSize for Pro model (Nano Banana series)
    const config: any = {
        imageConfig: {
            aspectRatio: "9:16",
        }
    };

    if (usePro) {
        config.imageConfig.imageSize = "1K";
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: prompt }] },
            config: config
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    } catch (e) {
        console.error("Image gen failed", e);
        throw e;
    }
    return null;
}