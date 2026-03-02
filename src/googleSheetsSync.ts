import { DailyMetrics, Task } from './types';

export interface SyncSettings {
  sheetUrl: string; // Single URL for both habits and tasks
  autoSync: boolean;
}

const SYNC_SETTINGS_KEY = 'synthPoke_syncSettings';

export const getSyncSettings = (): SyncSettings => {
  const saved = localStorage.getItem(SYNC_SETTINGS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    sheetUrl: '',
    autoSync: false
  };
};

export const saveSyncSettings = (settings: SyncSettings) => {
  localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(settings));
};

export const syncAllData = async (
  dailyMetrics: Record<string, DailyMetrics>,
  tasks: Task[],
  sheetUrl: string
): Promise<{ success: boolean; message: string }> => {
  if (!sheetUrl) {
    return { success: false, message: 'No sheet URL configured' };
  }

  try {
    // Prepare habits data
    const habitsEntries = Object.values(dailyMetrics).sort((a, b) => a.date.localeCompare(b.date));
    const habitsRows = habitsEntries.map(entry => ({
      date: entry.date,
      xpEarned: entry.xpEarned,
      workHours: entry.workHours,
      discoveryCalls: entry.discoveryCalls,
      networkingCalls: entry.networkingCalls,
      salesCalls: entry.salesCalls,
      firstDmsSent: entry.firstDmsSent,
      followUpsSent: entry.followUpsSent,
      commentingMinutes: entry.commentingMinutes,
      postsCreated: entry.postsCreated,
      postsPosted: entry.postsPosted,
      callsBooked: entry.callsBooked,
      callsTaken: entry.callsTaken,
      totalDmsSent: entry.totalDmsSent,
      timeAsleep: entry.timeAsleep,
      timeAwake: entry.timeAwake,
      coldShowers: entry.coldShowers,
      fastHours: entry.fastHours,
      exerciseType: entry.exerciseType,
      foodTracking: entry.foodTracking,
      affirmations: entry.affirmations,
      visualizations: entry.visualizations,
      planTomorrow: entry.planTomorrow,
      storyList: entry.storyList,
      journal: entry.journal,
      youtube: entry.youtube,
      reels: entry.reels,
      shorts: entry.shorts,
      processedFood: entry.processedFood,
      gaming: entry.gaming
    }));

    // Prepare tasks data
    const sortedTasks = [...tasks].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const tasksRows = sortedTasks.map(task => ({
      title: task.title,
      category: task.category,
      xpReward: task.xpReward,
      completed: task.completed,
      createdAt: task.createdAt,
      completedAt: task.completedAt || ''
    }));

    // Send both in one request
    await fetch(sheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        habits: habitsRows,
        tasks: tasksRows
      })
    });

    return { success: true, message: 'Synced to Google Sheets' };
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, message: `Sync failed: ${error}` };
  }
};
