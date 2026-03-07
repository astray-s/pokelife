import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { DailyMetrics, PlayerState, Quest, WeeklyBoss, Task, Boss, CustomHabits } from './types';
import { DEFAULT_BUSINESS_HABITS, DEFAULT_HEALTH_HABITS, DEFAULT_TRAINER_BOOSTS, DEFAULT_STATUS_EFFECTS } from './constants';

interface CloudData {
  playerState: PlayerState;
  dailyMetrics: Record<string, DailyMetrics>;
  quests: Quest[];
  weeklyBoss: WeeklyBoss | null;
  bosses: Boss[];
  tasks: Task[];
  lastSync: string;
}

// Remove undefined values from objects recursively (Firebase doesn't allow undefined)
function cleanUndefined(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanUndefined(item));
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        cleaned[key] = cleanUndefined(obj[key]);
      }
    }
    return cleaned;
  }
  
  return obj;
}

// Migrate old metrics to use custom habit IDs
function migrateMetrics(metrics: Record<string, DailyMetrics>, customHabits: CustomHabits): Record<string, DailyMetrics> {
  const migratedMetrics: Record<string, DailyMetrics> = {};
  
  Object.entries(metrics).forEach(([date, dayMetrics]) => {
    // Keep the metrics as-is, the calculateXP function will handle custom habits
    migratedMetrics[date] = dayMetrics;
  });
  
  return migratedMetrics;
}

export async function saveToCloud(
  userId: string,
  playerState: PlayerState,
  dailyMetrics: Record<string, DailyMetrics>,
  quests: Quest[],
  weeklyBoss: WeeklyBoss | null,
  bosses: Boss[],
  tasks: Task[]
): Promise<{ success: boolean; message: string }> {
  try {
    const cloudData: CloudData = {
      playerState,
      dailyMetrics,
      quests,
      weeklyBoss,
      bosses,
      tasks,
      lastSync: new Date().toISOString()
    };

    // Clean undefined values before saving to Firebase
    const cleanedData = cleanUndefined(cloudData);

    await setDoc(doc(db, 'users', userId), cleanedData);
    
    return {
      success: true,
      message: 'Data synced to cloud successfully'
    };
  } catch (error: any) {
    console.error('Cloud sync error:', error);
    return {
      success: false,
      message: `Sync failed: ${error.message}`
    };
  }
}

export async function loadFromCloud(userId: string): Promise<{
  success: boolean;
  message: string;
  data?: CloudData;
}> {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as CloudData;
      
      // Ensure customHabits exists
      if (!data.playerState.customHabits) {
        data.playerState.customHabits = {
          business: DEFAULT_BUSINESS_HABITS,
          health: DEFAULT_HEALTH_HABITS,
          trainerBoosts: DEFAULT_TRAINER_BOOSTS,
          statusEffects: DEFAULT_STATUS_EFFECTS
        };
      }
      
      // Migrate metrics if needed
      data.dailyMetrics = migrateMetrics(data.dailyMetrics, data.playerState.customHabits);
      
      return {
        success: true,
        message: 'Data loaded from cloud',
        data
      };
    } else {
      return {
        success: false,
        message: 'No cloud data found'
      };
    }
  } catch (error: any) {
    console.error('Cloud load error:', error);
    return {
      success: false,
      message: `Load failed: ${error.message}`
    };
  }
}
