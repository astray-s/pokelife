import { DailyMetrics, CaughtPokemon, Quest } from './types';

export interface WeeklyStats {
  totalHours: number;
  totalXP: number;
  level: number;
  pokemonCaught: CaughtPokemon[];
  bestQuest: Quest | null;
  completedQuests: number;
  weekStart: string;
  weekEnd: string;
}

const getWeekDates = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday as start
  
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
};

export const generateWeeklyStats = (
  dailyMetrics: Record<string, DailyMetrics>,
  playerLevel: number,
  monstersOwned: CaughtPokemon[],
  quests: Quest[]
): WeeklyStats => {
  const { weekStart, weekEnd } = getWeekDates();
  
  // Filter metrics for this week
  const weekMetrics = Object.values(dailyMetrics).filter(m => {
    const date = new Date(m.date);
    return date >= weekStart && date <= weekEnd;
  });
  
  // Calculate stats
  const totalHours = weekMetrics.reduce((sum, m) => sum + m.workHours, 0);
  const totalXP = weekMetrics.reduce((sum, m) => sum + m.xpEarned, 0);
  
  // Pokemon caught this week
  const pokemonCaught = monstersOwned.filter(p => {
    const caughtDate = new Date(p.caughtAt);
    return caughtDate >= weekStart && caughtDate <= weekEnd;
  });
  
  // Completed quests this week
  const completedQuests = quests.filter(q => q.status === 'claimed').length;
  
  // Best quest (highest XP)
  const bestQuest = quests
    .filter(q => q.status === 'claimed')
    .sort((a, b) => b.baseXPReward - a.baseXPReward)[0] || null;
  
  return {
    totalHours,
    totalXP,
    level: playerLevel,
    pokemonCaught,
    bestQuest,
    completedQuests,
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0]
  };
};

export const generateShareableCard = async (stats: WeeklyStats): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Card dimensions
  const width = 1200;
  const height = 630;
  canvas.width = width;
  canvas.height = height;
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add pattern overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(i * 60, j * 60, 30, 30);
      }
    }
  }
  
  // White card background
  const cardPadding = 40;
  const cardX = cardPadding;
  const cardY = cardPadding;
  const cardWidth = width - (cardPadding * 2);
  const cardHeight = height - (cardPadding * 2);
  
  ctx.fillStyle = 'white';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 30);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  
  // Header
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
  ctx.fillText('🎮 Weekly Progress', cardX + 50, cardY + 80);
  
  // Date range
  ctx.fillStyle = '#64748b';
  ctx.font = '24px system-ui, -apple-system, sans-serif';
  const dateText = `${formatDate(stats.weekStart)} - ${formatDate(stats.weekEnd)}`;
  ctx.fillText(dateText, cardX + 50, cardY + 120);
  
  // Stats grid
  const statsY = cardY + 180;
  const statBoxWidth = (cardWidth - 150) / 3;
  
  // Stat 1: Hours
  drawStatBox(ctx, cardX + 50, statsY, statBoxWidth, 150, '⏰', stats.totalHours.toFixed(1), 'Hours Worked', '#f59e0b');
  
  // Stat 2: XP
  drawStatBox(ctx, cardX + 50 + statBoxWidth + 25, statsY, statBoxWidth, 150, '⚡', stats.totalXP.toString(), 'XP Earned', '#3b82f6');
  
  // Stat 3: Level
  drawStatBox(ctx, cardX + 50 + (statBoxWidth + 25) * 2, statsY, statBoxWidth, 150, '🏆', `Level ${stats.level}`, 'Current Level', '#8b5cf6');
  
  // Bottom section
  const bottomY = statsY + 200;
  
  // Quests completed
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.fillText(`✅ ${stats.completedQuests} Quests Completed`, cardX + 50, bottomY);
  
  // Pokemon caught
  if (stats.pokemonCaught.length > 0) {
    ctx.fillText(`🎯 ${stats.pokemonCaught.length} Pokémon Caught`, cardX + 50, bottomY + 50);
    
    // Show pokemon names
    ctx.fillStyle = '#64748b';
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    const pokemonNames = stats.pokemonCaught.slice(0, 3).map(p => p.name).join(', ');
    const displayNames = stats.pokemonCaught.length > 3 ? `${pokemonNames}...` : pokemonNames;
    ctx.fillText(displayNames, cardX + 50, bottomY + 85);
  }
  
  // Best quest
  if (stats.bestQuest) {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('🌟 Best Quest:', cardX + 600, bottomY);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    const questText = truncateText(ctx, stats.bestQuest.name, 400);
    ctx.fillText(questText, cardX + 600, bottomY + 35);
    
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(`+${stats.bestQuest.baseXPReward} XP`, cardX + 600, bottomY + 65);
  }
  
  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px system-ui, -apple-system, sans-serif';
  ctx.fillText('PokeLife - Track your life, catch them all! 🎮', cardX + 50, height - 70);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStatBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  emoji: string,
  value: string,
  label: string,
  color: string
) {
  // Background
  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, x, y, width, height, 20);
  ctx.fill();
  
  // Colored accent
  ctx.fillStyle = color;
  roundRect(ctx, x, y, width, 6, 3);
  ctx.fill();
  
  // Emoji
  ctx.font = '40px system-ui, -apple-system, sans-serif';
  ctx.fillText(emoji, x + 20, y + 60);
  
  // Value
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  const valueWidth = ctx.measureText(value).width;
  ctx.fillText(value, x + width - valueWidth - 20, y + 60);
  
  // Label
  ctx.fillStyle = '#64748b';
  ctx.font = '18px system-ui, -apple-system, sans-serif';
  ctx.fillText(label, x + 20, y + height - 25);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  const width = ctx.measureText(text).width;
  if (width <= maxWidth) return text;
  
  let truncated = text;
  while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

export const downloadCard = (blob: Blob, filename: string = 'pokelife-weekly-progress.png') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const copyCardToClipboard = async (blob: Blob) => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
