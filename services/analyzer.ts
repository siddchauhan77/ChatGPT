import { ChatStats } from "../types";

const STOP_WORDS = new Set([
  'the', 'and', 'this', 'that', 'with', 'from', 'have', 'what', 'when', 'where',
  'your', 'chatgpt', 'openai', 'model', 'language', 'please', 'help', 'code', 'make',
  'sure', 'like', 'just', 'know', 'about', 'would', 'could', 'should', 'there', 'some'
]);

export const analyzeChatData = async (textOrJson: string): Promise<{ stats: ChatStats; sampleText: string }> => {
  let messages: { role: string; content: string; create_time?: number }[] = [];
  let isJson = false;

  // Attempt to parse as standard ChatGPT export JSON
  try {
    const data = JSON.parse(textOrJson);
    if (Array.isArray(data)) {
      // Handle array of conversations
      isJson = true;
      data.forEach((conversation: any) => {
        const mapping = conversation.mapping;
        if (mapping) {
          Object.values(mapping).forEach((node: any) => {
            const message = node.message;
            if (message && message.content && message.content.parts) {
              const role = message.author.role;
              const content = message.content.parts.join(' ');
              if (content.length > 0) {
                messages.push({
                  role,
                  content,
                  create_time: message.create_time
                });
              }
            }
          });
        }
      });
    }
  } catch (e) {
    // Not JSON, treat as raw text
    isJson = false;
  }

  if (!isJson) {
    // Robust Text Parsing
    const lines = textOrJson.split('\n').filter(line => line.trim().length > 0);
    
    // Heuristic: Check if the text contains common role headers
    const hasExplicitHeaders = lines.some(l => /^(user|you|me|chatgpt|ai|assistant|model)(\s*[:\-])?$/i.test(l.trim()));
    
    let currentRole = 'user'; // Default starting role

    lines.forEach(line => {
        const trimmed = line.trim();
        let isHeader = false;

        // Header detection logic
        if (hasExplicitHeaders) {
            if (/^(user|you|me)(\s*[:\-])?$/i.test(trimmed)) {
                currentRole = 'user';
                isHeader = true;
            } else if (/^(chatgpt|ai|assistant|model)(\s*[:\-])?$/i.test(trimmed)) {
                currentRole = 'assistant';
                isHeader = true;
            }
        } 
        
        // Inline prefix detection (e.g. "User: Hello") - always check this
        if (!isHeader) {
            if (/^(user|you|me):/i.test(trimmed)) {
                currentRole = 'user';
            } else if (/^(chatgpt|ai|assistant|model):/i.test(trimmed)) {
                currentRole = 'assistant';
            }
        }

        if (isHeader) return; // Skip the header line itself if it was just a label

        // Strip prefixes if present for the content
        let content = trimmed
            .replace(/^(user|you|me):/i, '')
            .replace(/^(chatgpt|ai|assistant|model):/i, '')
            .trim();
        
        if (content.length > 0) {
            messages.push({ role: currentRole, content });
        }
    });
    
    // Fallback: if we still have no structured messages (e.g. just a blob of text), treat it all as unknown/user
    if (messages.length === 0 && lines.length > 0) {
         messages = lines.map(line => ({ role: 'unknown', content: line }));
    }
  }

  const wordMap: Record<string, number> = {};
  const activeHours: Record<string, number> = {};
  let totalWords = 0;
  let userCount = 0;
  let aiCount = 0;

  // Process Stats
  messages.forEach(msg => {
    // Stats
    if (msg.role === 'user') userCount++;
    else if (msg.role === 'assistant') aiCount++;
    
    // Words
    const words = msg.content.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    totalWords += words.length;
    
    words.forEach(w => {
      if (w.length > 3 && !STOP_WORDS.has(w)) {
        wordMap[w] = (wordMap[w] || 0) + 1;
      }
    });

    // Timing (if available)
    if (msg.create_time) {
      const date = new Date(msg.create_time * 1000);
      const hour = date.getHours().toString();
      activeHours[hour] = (activeHours[hour] || 0) + 1;
    }
  });

  // Calculate Hours Spent
  let totalSeconds = 0;
  if (isJson && messages.some(m => m.create_time)) {
    // Sort by time
    const sortedMessages = messages.filter(m => m.create_time).sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
    
    if (sortedMessages.length > 1) {
        let sessionStart = sortedMessages[0].create_time!;
        let lastTime = sortedMessages[0].create_time!;

        // Initial session penalty (assuming first msg took 1 min)
        totalSeconds += 60; 

        for (let i = 1; i < sortedMessages.length; i++) {
            const current = sortedMessages[i].create_time!;
            const diff = current - lastTime;

            if (diff > 20 * 60) {
                // Gap > 20 mins, consider it a new session
                // Add fixed "start up" cost for new session (e.g. 1 min)
                totalSeconds += 60; 
                sessionStart = current;
            } else {
                // Continue session
                totalSeconds += diff;
            }
            lastTime = current;
        }
    } else if (sortedMessages.length === 1) {
        totalSeconds = 60;
    }
  } else {
    // Heuristic: 2 minutes per message interaction (reading + writing)
    totalSeconds = messages.length * 2 * 60;
  }
  
  const hoursSpent = Math.max(0.1, parseFloat((totalSeconds / 3600).toFixed(1)));


  // Sample Strategy: Randomly pick chunks to get a better distribution
  // We want ~5000 characters max
  let sampleText = "";
  const CHUNK_SIZE = 5; // messages per chunk
  const MAX_SAMPLES = 15; // max number of chunks
  
  if (messages.length <= 20) {
      // Small history, take it all
      sampleText = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content.slice(0, 300)}`).join('\n');
  } else {
      // Pick random starting points
      const indices = new Set<number>();
      while (indices.size < MAX_SAMPLES) {
          indices.add(Math.floor(Math.random() * (messages.length - CHUNK_SIZE)));
      }
      
      Array.from(indices).sort((a,b) => a-b).forEach(idx => {
          const chunk = messages.slice(idx, idx + CHUNK_SIZE);
          chunk.forEach(m => {
               sampleText += `${m.role === 'user' ? 'User' : 'AI'}: ${m.content.slice(0, 300)}\n`;
          });
          sampleText += "\n...[skipped]...\n";
      });
  }

  // Top words
  const topWords = Object.entries(wordMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Most active hour
  let mostActiveHour = 12; // Default
  if (Object.keys(activeHours).length > 0) {
    const sortedHours = Object.entries(activeHours).sort(([, a], [, b]) => b - a);
    mostActiveHour = parseInt(sortedHours[0][0]);
  }

  return {
    stats: {
      totalMessages: messages.length,
      userMessageCount: userCount || Math.floor(messages.length / 2),
      aiMessageCount: aiCount || Math.ceil(messages.length / 2),
      wordCount: totalWords,
      topWords,
      activeHours,
      mostActiveHour,
      hoursSpent
    },
    sampleText: sampleText.slice(0, 10000) // Hard cap just in case
  };
};