
export type Rarity = 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Pokemon {
  id: string;
  name: string;
  rarity: Rarity;
  imageUrl: string;
}

export interface CaughtPokemon extends Pokemon {
  instanceId: string;
  caughtAt: string;
  isShiny: boolean;
  // Individual characteristics
  height: number; // in meters
  weight: number; // in kg
  nature: string;
  characteristic: string;
  personality: string;
}

export interface DailyMetrics {
  date: string; // ISO YYYY-MM-DD
  
  // Main Attacks (Business & Work)
  workHours: number;
  discoveryCalls: number;
  networkingCalls: number;
  salesCalls: number;
  firstDmsSent: number;
  followUpsSent: number;
  commentingMinutes: number;
  postsCreated: number;
  postsPosted: number;
  callsBooked: number;
  callsTaken: number;
  totalDmsSent: number;

  // Special Moves (Health)
  timeAsleep: string; // HH:MM format (PM, e.g., "21:15" for 9:15 PM)
  timeAwake: string; // HH:MM format (AM, e.g., "05:00" for 5:00 AM)
  coldShowers: number; // count
  fastHours: number; // hours fasted
  exerciseType: string; // "none", "upper", "lower", "cardio"
  foodTracking: boolean; // did you track food today?

  // Trainer Boosts (Daily Habits - all checkboxes)
  affirmations: boolean;
  visualizations: boolean;
  planTomorrow: boolean;
  storyList: boolean;
  journal: boolean;

  // Status Effects (Bad Habits - decrease XP)
  youtube: boolean;
  reels: boolean;
  shorts: boolean;
  processedFood: boolean;
  gaming: boolean;

  xpEarned: number;
  claimedQuestIds: string[];
}

export type MetricKey = keyof Omit<DailyMetrics, 'date' | 'xpEarned' | 'claimedQuestIds'>;

export type QuestType = 'daily' | 'weekly';
export type QuestStatus = 'notStarted' | 'active' | 'completed' | 'claimed' | 'failed';

export interface QuestRequirement {
  metric: MetricKey;
  gte?: number;
  lte?: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  requirements: QuestRequirement[];
  baseXPReward: number;
  status: QuestStatus;
  startDate?: string;
  endDate?: string;
}

export interface Egg {
  id: string;
  rarity: Rarity;
  obtainedAt: string;
  source: string; // 'quest', 'boss', 'milestone', 'threshold'
}

export interface PlayerState {
  totalXP: number;
  level: number;
  monstersOwned: CaughtPokemon[];
  eggs: Egg[];
  questsSinceDrop: number;
  lastDailyReset: string;
  lastWeeklyReset: string;
  lastDailyEggClaim?: string; // Track last date daily egg was claimed
  customHabits?: CustomHabits;
  categoryVisibility?: CategoryVisibility;
  unlockedMilestones?: UnlockedMilestone[];
}

export interface UnlockedMilestone {
  milestoneId: string;
  unlockedAt: string;
  pokemon: CaughtPokemon;
}

export interface CustomHabits {
  business: HabitDefinition[];
  health: HabitDefinition[];
  trainerBoosts: HabitDefinition[];
  statusEffects: HabitDefinition[];
}

export interface HabitDefinition {
  id: string;
  label: string;
  type: 'number' | 'boolean' | 'dropdown';
  xpValue: number; // XP per unit (or flat XP for boolean)
  options?: string[]; // For dropdown type
  step?: string; // For number inputs
  min?: number;
  max?: number;
  sprite?: number; // Pokemon sprite ID
  isNegative?: boolean; // For status effects
}

export interface CategoryVisibility {
  business: boolean;
  health: boolean;
  trainerBoosts: boolean;
  statusEffects: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  xpReward: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export type TaskCategory = 'business' | 'school' | 'admin' | 'learning';

export const TASK_CATEGORY_XP: Record<TaskCategory, number> = {
  business: 100,
  school: 75,
  admin: 50,
  learning: 25
};

export interface WeeklyBoss {
  weekId: string;
  name: string;
  hpTotal: number;
  hpRemaining: number;
  weaknessType: keyof Omit<DailyMetrics, 'date' | 'xpEarned' | 'claimedQuestIds'>;
  defeated: boolean;
}
