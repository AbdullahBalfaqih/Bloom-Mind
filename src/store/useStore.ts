import { create } from 'zustand';
import { DecisionPipeline } from '../ai/pipeline/CorePipeline';
import { LocalGemmaProvider } from '../ai/providers';
import { 
  UpdateMemorySkill, 
  RecommendationGeneratorSkill, 
  DecideRewardsSkill, 
  UpdateFarmSkill, 
  ReasoningTraceSkill,
  ConfidenceSkill,
  ScheduleNotificationsSkill, 
  SaveToSQLiteSkill 
} from '../ai/pipeline/skills';

export type CropType = 'tomato' | 'mint' | 'sunflower' | 'corn' | 'carrot' | 'apple_tree' | 'orange_tree' | 'olive' | 'flower' | 'grass';
export type WeatherType = 'sunny' | 'rain' | 'wind';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

export interface PlantInstance {
  type: CropType;
  stage: 'seed' | 'sprout' | 'growing' | 'mature';
  waterProgress: number; 
}

export interface Plot {
  id: number;
  isPloughed: boolean;
  plant: PlantInstance | null;
}

interface AppState {
  totalFocusTime: number; 
  streak: number;
  waterPoints: number;
  seeds: Record<CropType, number>;
  plots: Plot[];
  harvested: Record<CropType, number>;
  xp: number;
  
  // Environment
  hasLake: boolean;
  weather: WeatherType;
  season: SeasonType;
  
  addFocusTime: (minutes: number) => void;
  plowPlot: (plotId: number) => void;
  plantSeed: (plotId: number, type: CropType) => void;
  waterPlant: (plotId: number) => void;
  harvestPlant: (plotId: number) => void;
  incrementStreak: () => void;
  handleSessionEnd: (minutes: number) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  totalFocusTime: 120,
  streak: 3,
  waterPoints: 15,
  seeds: {
    tomato: 3, mint: 2, sunflower: 1, corn: 0, carrot: 0, 
    apple_tree: 0, orange_tree: 0, olive: 0, flower: 0, grass: 0
  },
  plots: [
    { id: 0, isPloughed: true, plant: { type: 'tomato', stage: 'sprout', waterProgress: 1 } },
    { id: 1, isPloughed: false, plant: null },
    { id: 2, isPloughed: true, plant: { type: 'mint', stage: 'growing', waterProgress: 2 } },
    { id: 3, isPloughed: false, plant: null },
    { id: 4, isPloughed: false, plant: null },
    { id: 5, isPloughed: false, plant: null },
  ],
  harvested: {
    tomato: 2, mint: 1, sunflower: 0, corn: 0, carrot: 0, 
    apple_tree: 0, orange_tree: 0, olive: 0, flower: 0, grass: 0
  },
  xp: 120,
  hasLake: false,
  weather: 'sunny',
  season: 'spring',

  addFocusTime: (minutes: number) =>
    set((state) => ({
      totalFocusTime: state.totalFocusTime + minutes,
      waterPoints: state.waterPoints + minutes, // 1 minute focus = 1 water drop!
      xp: state.xp + (minutes * 2), // Earn XP from focus
    })),

  plowPlot: (plotId: number) =>
    set((state) => {
      const newPlots = state.plots.map((plot) => {
        if (plot.id === plotId && !plot.isPloughed) {
          return {
            ...plot,
            isPloughed: true,
          };
        }
        return plot;
      });
      return {
        plots: newPlots,
        xp: state.xp + 5, // 5 XP for plowing
      };
    }),

  plantSeed: (plotId: number, type: 'tomato' | 'mint' | 'sunflower') =>
    set((state) => {
      // Check if we have seeds left
      if (state.seeds[type] <= 0) return state;

      const newPlots = state.plots.map((plot) => {
        if (plot.id === plotId && plot.isPloughed && plot.plant === null) {
          return {
            ...plot,
            plant: {
              type,
              stage: 'seed' as const,
              waterProgress: 0,
            },
          };
        }
        return plot;
      });

      return {
        plots: newPlots,
        seeds: {
          ...state.seeds,
          [type]: state.seeds[type] - 1,
        },
      };
    }),

  waterPlant: (plotId: number) =>
    set((state) => {
      // Check if we have water drops left
      if (state.waterPoints <= 0) return state;

      const newPlots = state.plots.map((plot) => {
        if (plot.id === plotId && plot.plant !== null && plot.plant.stage !== 'mature') {
          const plant = plot.plant;
          const nextProgress = plant.waterProgress + 1;

          if (nextProgress >= 3) {
            // Evolve plant to next stage
            let nextStage = plant.stage;
            if (plant.stage === 'seed') nextStage = 'sprout';
            else if (plant.stage === 'sprout') nextStage = 'growing';
            else if (plant.stage === 'growing') nextStage = 'mature';

            return {
              ...plot,
              plant: {
                ...plant,
                stage: nextStage,
                waterProgress: 0,
              },
            };
          } else {
            return {
              ...plot,
              plant: {
                ...plant,
                waterProgress: nextProgress,
              },
            };
          }
        }
        return plot;
      });

      return {
        plots: newPlots,
        waterPoints: state.waterPoints - 1,
        xp: state.xp + 10, // give 10 XP for watering
      };
    }),

  harvestPlant: (plotId: number) =>
    set((state) => {
      const targetPlot = state.plots.find((p) => p.id === plotId);
      if (!targetPlot || !targetPlot.plant || targetPlot.plant.stage !== 'mature') return state;

      const type = targetPlot.plant.type;
      
      // Award random seed sometimes
      const isLucky = Math.random() > 0.4;
      const seedAward: Partial<typeof state.seeds> = {};
      if (isLucky) {
        const types: ('tomato' | 'mint' | 'sunflower')[] = ['tomato', 'mint', 'sunflower'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        seedAward[randomType] = state.seeds[randomType] + 1;
      }

      const newPlots = state.plots.map((plot) => {
        if (plot.id === plotId) {
          return {
            ...plot,
            plant: null,
          };
        }
        return plot;
      });

      return {
        plots: newPlots,
        xp: state.xp + 100, // Harvest awards 100 XP!
        harvested: {
          ...state.harvested,
          [type]: state.harvested[type] + 1,
        },
        seeds: {
          ...state.seeds,
          ...seedAward,
        },
      };
    }),

  incrementStreak: () =>
    set((state) => ({ streak: state.streak + 1 })),
    
  handleSessionEnd: async (minutes: number) => {
    // 1. Regular store updates
    set((state) => ({
      totalFocusTime: state.totalFocusTime + minutes,
      waterPoints: state.waterPoints + minutes,
      xp: state.xp + (minutes * 2),
    }));

    // 2. Instantiate and Run the Autonomous AI Decision Pipeline
    const pipeline = new DecisionPipeline([
      new UpdateMemorySkill(),
      new RecommendationGeneratorSkill(),
      new DecideRewardsSkill(),
      new ReasoningTraceSkill(),
      new ConfidenceSkill(),
      new UpdateFarmSkill(),
      new ScheduleNotificationsSkill(),
      new SaveToSQLiteSkill()
    ]);

    const context = await pipeline.run({
      sessionLengthMinutes: minutes,
      aiProvider: new LocalGemmaProvider(),
      storeGetState: get,
      storeSetState: set
    });

    console.log("PIPELINE EXECUTION COMPLETE.");
    if (context.aiDecision) {
      console.log(`[AI Confidence: ${(context.confidenceScore! * 100).toFixed(0)}%]`);
      console.log(`[Reasoning Trace]:`, context.reasoningTrace);
    }
  }
}));
