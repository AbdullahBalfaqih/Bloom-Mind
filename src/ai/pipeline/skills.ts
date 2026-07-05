import { ISkill, SkillContext } from './CorePipeline';
import { useMemoryEngine } from '../memory';
import type { CropType } from '../../store/useStore';
import { PredictionEngine } from '../prediction';
import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';

export class UpdateMemorySkill implements ISkill {
  async execute(context: SkillContext): Promise<void> {
    const memoryEngine = useMemoryEngine.getState();
    memoryEngine.updateBehavior({
      dailySessions: memoryEngine.behavior.dailySessions + 1,
    });
    console.log("[UpdateMemorySkill] Memory updated.");
  }
}

export class RecommendationGeneratorSkill implements ISkill {
  async execute(context: SkillContext): Promise<void> {
    const memory = useMemoryEngine.getState().behavior;
    const predictions = PredictionEngine.predict(memory);
    
    // Pass raw data into the context for Gemma
    context.behavioralData = {
      memory,
      predictions
    };
    console.log("[RecommendationGeneratorSkill] Behavioral data prepared for AI.");
  }
}

export class DecideRewardsSkill implements ISkill {
  async execute(context: SkillContext): Promise<void> {
    if (!context.behavioralData) throw new Error("Missing behavioral data");

    const prompt = "Analyze the session end. Output ONLY strict JSON according to the BloomMind schema.";
    
    // Uses the LocalGemmaProvider (which contains the PromptBuilder, ContextBuilder, etc.)
    const jsonOutput = await context.aiProvider.analyzeJSON(prompt, {
      recentSessionLength: context.sessionLengthMinutes,
      memory: context.behavioralData.memory,
      predictions: context.behavioralData.predictions
    });

    context.aiDecision = jsonOutput;
    console.log("[DecideRewardsSkill] AI Reward Decision Generated:", jsonOutput);
  }
}

export class ConfidenceSkill implements ISkill {
  async execute(context: SkillContext): Promise<void> {
    if (!context.aiDecision) return;
    
    // Simulate Gemma confidence score calculation based on prediction certainty
    const certainty = context.sessionLengthMinutes > 15 ? 0.93 : 0.72;
    context.confidenceScore = certainty;
    console.log(`[ConfidenceSkill] Decision Confidence calculated: ${(certainty * 100).toFixed(0)}%`);
  }
}

export class ReasoningTraceSkill implements ISkill {
  async execute(context: SkillContext): Promise<void> {
    if (!context.aiDecision) return;

    // Build explainability trace
    const trace = [];
    if (context.sessionLengthMinutes >= 30) trace.push("Deep work session exceeded 30 minutes.");
    if (context.aiDecision.focus_score > 80) trace.push("Focus score above 80%.");
    if (context.aiDecision.should_reward) trace.push("Positive reinforcement threshold met.");

    context.reasoningTrace = trace;
    console.log("[ReasoningTraceSkill] Reasoning trace logged for explainability.");
  }
}

export class UpdateFarmSkill implements ISkill {
  async execute(context: SkillContext): Promise<void> {
    if (!context.aiDecision) return;

    const store = context.storeGetState();
    const decision = context.aiDecision;
    
    if (decision.should_reward) {
      const recommended = decision.recommended_crop.toLowerCase().replace(' ', '_') as CropType;
      const seeds = { ...store.seeds };
      if (seeds[recommended] !== undefined) {
        seeds[recommended] += 1;
      } else {
        seeds.apple_tree += 1;
      }

      context.storeSetState({
        seeds,
        hasLake: decision.focus_score > 80 ? true : store.hasLake,
        weather: decision.habit_score > 60 ? 'rain' : store.weather,
      });
      console.log(`[UpdateFarmSkill] Farm evolved. Reward granted: ${recommended}`);
    }
  }
}

export class ScheduleNotificationsSkill implements ISkill {
  async execute(context: SkillContext): Promise<void> {
    if (!context.aiDecision) return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      let message = "Your garden is waiting for you! Let's focus for a bit.";
      if (context.aiDecision.burnout_probability > 0.5) {
        message = "You've been working hard. Take a mindful break before returning to the garden.";
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "BloomMind AI 🌿",
          body: message,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3600, // 1 hour from now
        },
      });
      console.log("[ScheduleNotificationsSkill] Native push notification scheduled.");
    } catch (e) {
      console.log("[ScheduleNotificationsSkill] Notification permissions might be disabled.", e);
    }
  }
}

export class SaveToSQLiteSkill implements ISkill {
  async execute(context: SkillContext): Promise<void> {
    console.log("[SaveToSQLiteSkill] Attempting to save state to local SQLite DB...");
    try {
      const db = SQLite.openDatabaseSync('bloommind.db');
      db.execSync(`
        CREATE TABLE IF NOT EXISTS ai_state (
          id INTEGER PRIMARY KEY NOT NULL,
          memory_blob TEXT,
          farm_blob TEXT,
          last_updated INTEGER
        );
      `);

      const memory = useMemoryEngine.getState().behavior;
      const farm = context.storeGetState();

      const stmt = db.prepareSync(`INSERT OR REPLACE INTO ai_state (id, memory_blob, farm_blob, last_updated) VALUES (1, ?, ?, ?)`);
      stmt.executeSync([
        JSON.stringify(memory), 
        JSON.stringify(farm), 
        Date.now()
      ]);
      
      console.log("[SaveToSQLiteSkill] Successfully persisted AI & Farm state to SQLite offline.");
    } catch (error) {
      console.error("[SaveToSQLiteSkill] SQLite Error (ignored to prevent crash):", error);
    }
  }
}
