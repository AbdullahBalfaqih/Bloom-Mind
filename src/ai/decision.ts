import { AIProvider, LocalGemmaProvider } from './providers';
import { useMemoryEngine } from './memory';
import { PredictionEngine } from './prediction';

export interface AIDecisionOutput {
  focus_score: number;
  habit_score: number;
  risk_level: 'low' | 'medium' | 'high';
  burnout_probability: number;
  predicted_tomorrow_usage: number;
  recommended_limit: number;
  should_reward: boolean;
  recommended_crop: string;
  recommended_action: string;
  reasoning: string;
}

export class DecisionEngine {
  private ai: AIProvider;

  constructor() {
    this.ai = new LocalGemmaProvider(); 
  }

  /**
   * Called automatically when a session finishes.
   */
  public async analyzeSessionEnd(sessionLengthMinutes: number): Promise<AIDecisionOutput> {
    const memory = useMemoryEngine.getState().behavior;
    const predictions = PredictionEngine.predict(memory);

    // Context map to feed the Gemma LLM
    const context = {
      recentSessionLength: sessionLengthMinutes,
      averageUsage: memory.averageUsageHours,
      predictions,
      recentFailures: memory.previousFailures,
      streak: memory.currentStreak
    };

    const prompt = `Analyze the session end. Output ONLY strict JSON according to the BloomMind schema. Context: ${JSON.stringify(context)}`;

    // Get strict JSON from the local model
    const jsonOutput = await this.ai.analyzeJSON(prompt, context);
    
    return jsonOutput as AIDecisionOutput;
  }
}

export const decisionEngine = new DecisionEngine();
