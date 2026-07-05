import { LocalGemmaProvider } from '../providers';
import { AIDecisionOutput } from '../decision';

/**
 * Context passed through the entire pipeline.
 */
export interface SkillContext {
  sessionLengthMinutes: number;
  aiProvider: LocalGemmaProvider;
  
  // Dependency injected state accessors to break circular dependencies
  storeGetState: () => any;
  storeSetState: (partial: any) => void;
  
  // Accumulated state throughout the pipeline
  behavioralData?: any;
  aiDecision?: AIDecisionOutput;
  confidenceScore?: number;
  reasoningTrace?: string[];
}

export interface ISkill {
  execute(context: SkillContext): Promise<void>;
}

export class DecisionPipeline {
  private skills: ISkill[] = [];

  constructor(skills: ISkill[]) {
    this.skills = skills;
  }

  public async run(initialContext: SkillContext): Promise<SkillContext> {
    const context = { ...initialContext };
    
    for (const skill of this.skills) {
      try {
        await skill.execute(context);
      } catch (error) {
        console.error(`[Pipeline Error] Skill failed:`, error);
        // We catch errors to ensure the app NEVER crashes during execution
      }
    }
    
    return context;
  }
}
