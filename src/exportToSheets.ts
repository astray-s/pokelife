import { DailyMetrics, Task } from './types';

export const exportHabitsToCSV = (dailyMetrics: Record<string, DailyMetrics>) => {
  const entries = Object.values(dailyMetrics).sort((a, b) => a.date.localeCompare(b.date));
  
  if (entries.length === 0) {
    alert('No habit data to export');
    return;
  }

  // CSV Headers
  const headers = [
    'Date',
    'XP Earned',
    // Business
    'Work Hours',
    'Discovery Calls',
    'Networking Calls',
    'Sales Calls',
    'First DMs Sent',
    'Follow-ups Sent',
    'Commenting Minutes',
    'Posts Created',
    'Posts Posted',
    'Calls Booked',
    'Calls Taken',
    'Total DMs Sent',
    // Health
    'Time Asleep',
    'Time Awake',
    'Cold Showers',
    'Fast Hours',
    'Exercise Type',
    'Food Tracking',
    // Trainer Boosts
    'Affirmations',
    'Visualizations',
    'Plan Tomorrow',
    'Story List',
    'Journal',
    // Status Effects
    'YouTube',
    'Reels',
    'Shorts',
    'Processed Food',
    'Gaming'
  ];

  // CSV Rows
  const rows = entries.map(entry => [
    entry.date,
    entry.xpEarned,
    // Business
    entry.workHours,
    entry.discoveryCalls,
    entry.networkingCalls,
    entry.salesCalls,
    entry.firstDmsSent,
    entry.followUpsSent,
    entry.commentingMinutes,
    entry.postsCreated,
    entry.postsPosted,
    entry.callsBooked,
    entry.callsTaken,
    entry.totalDmsSent,
    // Health
    entry.timeAsleep,
    entry.timeAwake,
    entry.coldShowers,
    entry.fastHours,
    entry.exerciseType,
    entry.foodTracking ? 'Yes' : 'No',
    // Trainer Boosts
    entry.affirmations ? 'Yes' : 'No',
    entry.visualizations ? 'Yes' : 'No',
    entry.planTomorrow ? 'Yes' : 'No',
    entry.storyList ? 'Yes' : 'No',
    entry.journal ? 'Yes' : 'No',
    // Status Effects
    entry.youtube ? 'Yes' : 'No',
    entry.reels ? 'Yes' : 'No',
    entry.shorts ? 'Yes' : 'No',
    entry.processedFood ? 'Yes' : 'No',
    entry.gaming ? 'Yes' : 'No'
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape cells that contain commas or quotes
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(','))
  ].join('\n');

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pokelife-habits-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportTasksToCSV = (tasks: Task[]) => {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  // Sort by creation date
  const sortedTasks = [...tasks].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  // CSV Headers
  const headers = [
    'Title',
    'Category',
    'XP Reward',
    'Completed',
    'Created At',
    'Completed At'
  ];

  // CSV Rows
  const rows = sortedTasks.map(task => [
    task.title,
    task.category,
    task.xpReward,
    task.completed ? 'Yes' : 'No',
    new Date(task.createdAt).toLocaleString(),
    task.completedAt ? new Date(task.completedAt).toLocaleString() : ''
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape cells that contain commas or quotes
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(','))
  ].join('\n');

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pokelife-tasks-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
