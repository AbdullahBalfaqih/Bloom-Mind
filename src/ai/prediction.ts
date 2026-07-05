import { BehavioralMemory } from './memory';

export class PredictionEngine {
  
  /**
   * Predicts metrics based on historical memory.
   */
  public static predict(memory: BehavioralMemory) {
    const predictedUsage = this.predictTomorrowUsage(memory);
    const burnoutRisk = this.calculateBurnoutProbability(memory);
    const streakRisk = this.calculateStreakBreakProbability(memory);
    
    return {
      predictedUsage,
      burnoutRisk,
      streakRisk,
      idealDailyLimit: Math.max(30, predictedUsage * 0.8) // recommend 20% reduction
    };
  }

  private static predictTomorrowUsage(memory: BehavioralMemory): number {
    // Basic predictive heuristic: moving average
    if (memory.averageUsageHours > 0) {
      return memory.averageUsageHours;
    }
    return 120; // fallback to 2 hours
  }

  private static calculateBurnoutProbability(memory: BehavioralMemory): number {
    // If daily sessions are high and average usage is high, burnout is higher
    if (memory.dailySessions > 10 && memory.averageUsageHours > 4) {
      return 0.7; // 70% risk
    }
    return 0.2;
  }

  private static calculateStreakBreakProbability(memory: BehavioralMemory): number {
    // If user failed recently, risk is higher
    if (memory.previousFailures.length > memory.previousSuccesses.length) {
      return 0.6;
    }
    return 0.1;
  }
}
