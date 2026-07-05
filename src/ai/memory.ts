import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface BehavioralMemory {
  dailySessions: number;
  weeklyHours: number;
  monthlyHours: number;
  currentStreak: number;
  longestStreak: number;
  mostAddictiveApps: string[];
  averageUsageHours: number;
  previousRecommendations: string[];
  previousFailures: string[];
  previousSuccesses: string[];
}

interface AIMemoryState {
  chatHistory: ChatMessage[];
  behavior: BehavioralMemory;
  
  // Actions
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  recordSuccess: (successStr: string) => void;
  recordFailure: (failureStr: string) => void;
  updateBehavior: (partialBehavior: Partial<BehavioralMemory>) => void;
}

export const useMemoryEngine = create<AIMemoryState>((set) => ({
  chatHistory: [
    { id: '1', text: "Welcome to BloomMind! I'm your on-device AI coach. I analyze your habits locally and help your garden grow. What's our focus goal today?", sender: 'ai', timestamp: Date.now() - 1000 }
  ],
  behavior: {
    dailySessions: 0,
    weeklyHours: 0,
    monthlyHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    mostAddictiveApps: [],
    averageUsageHours: 0,
    previousRecommendations: [],
    previousFailures: [],
    previousSuccesses: [],
  },

  addMessage: (msg) => set((state) => ({
    chatHistory: [...state.chatHistory, {
      ...msg,
      id: Date.now().toString(),
      timestamp: Date.now()
    }]
  })),

  recordSuccess: (successStr) => set((state) => ({
    behavior: {
      ...state.behavior,
      previousSuccesses: [...state.behavior.previousSuccesses, successStr]
    }
  })),

  recordFailure: (failureStr) => set((state) => ({
    behavior: {
      ...state.behavior,
      previousFailures: [...state.behavior.previousFailures, failureStr]
    }
  })),

  updateBehavior: (partialBehavior) => set((state) => ({
    behavior: {
      ...state.behavior,
      ...partialBehavior
    }
  }))
}));
