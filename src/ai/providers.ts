/**
 * AI Provider Abstraction
 * This allows swapping out on-device LLMs seamlessly.
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Extract the laptop's local IP address from Expo's dev server URI
const packagerIp = Constants.expoConfig?.hostUri?.split(':')[0];
const OLLAMA_HOST = packagerIp || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const OLLAMA_URL = `http://${OLLAMA_HOST}:11435/api/generate`;

console.log("[Ollama Setup] Packager IP detected:", packagerIp);
console.log("[Ollama Setup] Final Endpoint:", OLLAMA_URL);

export interface AIProvider {
  /**
   * Initialize the model weights locally.
   */
  init(): Promise<void>;
  
  /**
   * Generates conversational text.
   */
  chat(prompt: string, history: any[]): Promise<string>;

  /**
   * Generates a strict JSON response for autonomous decision making.
   */
  analyzeJSON(prompt: string, context: any): Promise<any>;
}

export class LocalGemmaProvider implements AIProvider {
  private isInitialized = false;

  async init(): Promise<void> {
    // RESPONSIBILITY: Load a local Gemma model.
    // In a real native implementation, this would load the .tflite or .bin Gemma weights into RAM
    console.log("[LocalGemmaProvider] Loading Google Gemma weights locally...");
    await new Promise(res => setTimeout(res, 500));
    this.isInitialized = true;
    console.log("[LocalGemmaProvider] Model initialized successfully offline.");
  }

  async chat(prompt: string, history: any[]): Promise<string> {
    if (!this.isInitialized) await this.init();
    
    // RESPONSIBILITY: Execute local inference (No internet, No OpenAI, No Gemini API)
    console.log("[LocalGemmaProvider] Running local inference via Ollama for chat...");
    
    const systemPrompt = `You are the BloomMind AI Coach. Your primary goal is to help the user reduce social media addiction, minimize non-productive screen time, and stay focused on meaningful work/study. The virtual farm is just a reward mechanism. DO NOT talk about 'Llama' or focus excessively on the 'farm' unless asked. Instead, provide practical advice on digital well-being, avoiding distractions, and building healthy habits. Be concise, empathetic, and always respond in the SAME language the user speaks.`;
    
    // Convert chat history into context string for simple generate endpoint
    const historyText = history.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n');
    const fullPrompt = `${systemPrompt}\n\nHistory:\n${historyText}\nUser: ${prompt}\nAI:`;

    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma:2b',
          prompt: fullPrompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama Error: ${response.status}`);
      }

      const data = await response.json();
      return data.response.trim();
    } catch (e) {
      console.error("[LocalGemmaProvider] Failed to connect to Ollama:", e);
      return "يبدو أن خادم Ollama المحلي غير متصل. تأكد من تشغيل `ollama run gemma:2b` في جهازك! 🔌";
    }
  }

  // ---------------------------------------------------------
  // Agentic Sub-Modules
  // ---------------------------------------------------------

  private compressMemory(memory: any): any {
    // Compress long term memory into a dense summary to fit context windows
    console.log("[LocalGemmaProvider] Compressing memory...");
    return {
      streak: memory?.currentStreak || 0,
      recentFailures: memory?.previousFailures?.slice(-3) || [],
      avgUsage: memory?.averageUsageHours || 0,
    };
  }

  private buildContext(rawContext: any): any {
    // Standardizes incoming data
    console.log("[LocalGemmaProvider] Building context schema...");
    return {
      sessionDuration: rawContext?.recentSessionLength || 0,
      compressedMemory: this.compressMemory(rawContext?.memory),
      predictions: rawContext?.predictions || {}
    };
  }

  private buildPrompt(context: any): string {
    console.log("[LocalGemmaProvider] Building system prompt...");
    return `
      System: You are BloomMind AI. Analyze the user's session.
      Context: ${JSON.stringify(context)}
      Task: Output strict JSON. Do not hallucinate.
    `.trim();
  }

  private validateJSON(rawOutput: any): boolean {
    console.log("[LocalGemmaProvider] Validating JSON strict schema...");
    if (!rawOutput) return false;
    if (typeof rawOutput.focus_score !== 'number') return false;
    if (typeof rawOutput.should_reward !== 'boolean') return false;
    return true;
  }

  // ---------------------------------------------------------
  // Main Inference Loop
  // ---------------------------------------------------------

  async analyzeJSON(prompt: string, rawContext: any): Promise<any> {
    if (!this.isInitialized) await this.init();

    const builtContext = this.buildContext(rawContext);
    const finalPrompt = this.buildPrompt(builtContext) + 
      "\nOutput MUST be valid JSON, strictly matching the schema. No markdown, no extra text.";

    console.log("[LocalGemmaProvider] Executing local inference via Ollama (JSON Mode)...");
    
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma:2b',
          prompt: finalPrompt,
          format: 'json',
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama Error: ${response.status}`);
      }

      const data = await response.json();
      const rawLLMOutput = JSON.parse(data.response.trim());

      if (!this.validateJSON(rawLLMOutput)) {
        throw new Error("LocalGemmaProvider: JSON Validation Failed!");
      }

      return rawLLMOutput;
    } catch (e) {
      console.error("[LocalGemmaProvider] Failed to connect to Ollama for JSON:", e);
      // Fallback for safety during hackathon demo if Ollama drops connection
      const isGoodBehavior = builtContext.sessionDuration > 30;
      return {
        focus_score: isGoodBehavior ? 85 : 40,
        habit_score: isGoodBehavior ? 70 : 30,
        risk_level: isGoodBehavior ? "low" : "high",
        burnout_probability: 0.15,
        predicted_tomorrow_usage: builtContext.compressedMemory.avgUsage > 0 ? builtContext.compressedMemory.avgUsage : 120,
        recommended_limit: 60,
        should_reward: isGoodBehavior,
        recommended_crop: isGoodBehavior ? "Apple tree" : "Grass",
        recommended_action: isGoodBehavior ? "Unlock new crop tier" : "Suggest easier goal",
        reasoning: "Ollama connection failed, returning fallback heuristics."
      };
    }
  }
}

export class FutureProvider implements AIProvider {
  async init(): Promise<void> {
    console.log("[FutureProvider] Initializing...");
  }

  async chat(prompt: string, history: any[]): Promise<string> {
    return "Future provider chat placeholder.";
  }

  async analyzeJSON(prompt: string, context: any): Promise<any> {
    return {};
  }
}
