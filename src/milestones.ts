import { DailyMetrics, CaughtPokemon, Rarity } from './types';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  badge: string; // Emoji
  checkCondition: (metrics: Record<string, DailyMetrics>) => boolean;
  reward: {
    rarity: Rarity;
    message: string;
  };
}

export interface UnlockedMilestone {
  milestoneId: string;
  unlockedAt: string;
  pokemon: CaughtPokemon;
}

// Hidden milestone definitions
export const MILESTONES: Milestone[] = [
  {
    id: 'deep-work-warrior',
    name: 'Deep Work Warrior',
    description: 'Worked 3+ hours for 10 consecutive days',
    badge: '🔥',
    checkCondition: (metrics) => {
      const sortedDates = Object.keys(metrics).sort();
      let consecutiveDays = 0;
      let maxConsecutive = 0;
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        if (metrics[date].workHours >= 3) {
          consecutiveDays++;
          maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
        } else {
          consecutiveDays = 0;
        }
      }
      
      return maxConsecutive >= 10;
    },
    reward: {
      rarity: 'epic',
      message: 'Your dedication to deep work has earned you an Epic Egg!'
    }
  },
  {
    id: 'early-bird',
    name: 'Early Bird Master',
    description: 'Woke up by 5 AM for 7 consecutive days',
    badge: '🌅',
    checkCondition: (metrics) => {
      const sortedDates = Object.keys(metrics).sort();
      let consecutiveDays = 0;
      let maxConsecutive = 0;
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        const awakeTime = metrics[date].timeAwake;
        if (awakeTime) {
          const [hours] = awakeTime.split(':').map(Number);
          if (hours <= 5) {
            consecutiveDays++;
            maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
          } else {
            consecutiveDays = 0;
          }
        } else {
          consecutiveDays = 0;
        }
      }
      
      return maxConsecutive >= 7;
    },
    reward: {
      rarity: 'rare',
      message: 'Your early morning discipline has earned you a Rare Egg!'
    }
  },
  {
    id: 'sales-legend',
    name: 'Sales Legend',
    description: 'Completed 50+ total sales calls',
    badge: '💰',
    checkCondition: (metrics) => {
      const totalSalesCalls = Object.values(metrics).reduce((sum, m) => sum + m.salesCalls, 0);
      return totalSalesCalls >= 50;
    },
    reward: {
      rarity: 'rare',
      message: 'Your sales mastery has earned you a Rare Egg!'
    }
  },
  {
    id: 'cold-shower-champion',
    name: 'Ice Bath Champion',
    description: 'Took 30+ cold showers total',
    badge: '❄️',
    checkCondition: (metrics) => {
      const totalColdShowers = Object.values(metrics).reduce((sum, m) => sum + m.coldShowers, 0);
      return totalColdShowers >= 30;
    },
    reward: {
      rarity: 'epic',
      message: 'Your resilience to cold has earned you an Epic Egg!'
    }
  },
  {
    id: 'content-creator',
    name: 'Content Creator Pro',
    description: 'Posted 100+ total posts',
    badge: '📱',
    checkCondition: (metrics) => {
      const totalPosts = Object.values(metrics).reduce((sum, m) => sum + m.postsPosted, 0);
      return totalPosts >= 100;
    },
    reward: {
      rarity: 'epic',
      message: 'Your content creation prowess has earned you an Epic Egg!'
    }
  },
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: 'Completed all daily habits for 7 consecutive days',
    badge: '⭐',
    checkCondition: (metrics) => {
      const sortedDates = Object.keys(metrics).sort();
      let consecutiveDays = 0;
      let maxConsecutive = 0;
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        const m = metrics[date];
        const allHabits = m.affirmations && m.visualizations && m.planTomorrow && m.storyList && m.journal;
        const noBadHabits = !m.youtube && !m.reels && !m.shorts && !m.processedFood && !m.gaming;
        
        if (allHabits && noBadHabits) {
          consecutiveDays++;
          maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
        } else {
          consecutiveDays = 0;
        }
      }
      
      return maxConsecutive >= 7;
    },
    reward: {
      rarity: 'epic',
      message: 'Your perfect consistency has earned you an Epic Egg!'
    }
  },
  {
    id: 'networking-ninja',
    name: 'Networking Ninja',
    description: 'Sent 500+ total DMs',
    badge: '💬',
    checkCondition: (metrics) => {
      const totalDMs = Object.values(metrics).reduce((sum, m) => sum + m.totalDmsSent, 0);
      return totalDMs >= 500;
    },
    reward: {
      rarity: 'epic',
      message: 'Your networking genius has earned you an Epic Egg!'
    }
  },
  {
    id: 'fitness-fanatic',
    name: 'Fitness Fanatic',
    description: 'Exercised 30+ days total',
    badge: '💪',
    checkCondition: (metrics) => {
      const exerciseDays = Object.values(metrics).filter(m => m.exerciseType && m.exerciseType !== 'none').length;
      return exerciseDays >= 30;
    },
    reward: {
      rarity: 'rare',
      message: 'Your fitness dedication has earned you a Rare Egg!'
    }
  },
  {
    id: 'call-booking-master',
    name: 'Call Booking Master',
    description: 'Booked 25+ total calls',
    badge: '📞',
    checkCondition: (metrics) => {
      const totalCallsBooked = Object.values(metrics).reduce((sum, m) => sum + m.callsBooked, 0);
      return totalCallsBooked >= 25;
    },
    reward: {
      rarity: 'rare',
      message: 'Your persuasion skills have earned you a Rare Egg!'
    }
  },
  {
    id: 'zen-master',
    name: 'Zen Master',
    description: 'Completed affirmations and visualizations for 21 consecutive days',
    badge: '🧘',
    checkCondition: (metrics) => {
      const sortedDates = Object.keys(metrics).sort();
      let consecutiveDays = 0;
      let maxConsecutive = 0;
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        const m = metrics[date];
        
        if (m.affirmations && m.visualizations) {
          consecutiveDays++;
          maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
        } else {
          consecutiveDays = 0;
        }
      }
      
      return maxConsecutive >= 21;
    },
    reward: {
      rarity: 'rare',
      message: 'Your mindfulness practice has earned you a Rare Egg!'
    }
  },
  {
    id: 'legendary-grinder',
    name: 'Legendary Grinder',
    description: 'Reached 10,000 total XP',
    badge: '👑',
    checkCondition: (metrics) => {
      const totalXP = Object.values(metrics).reduce((sum, m) => sum + m.xpEarned, 0);
      return totalXP >= 10000;
    },
    reward: {
      rarity: 'legendary',
      message: 'Your legendary dedication has earned you a Legendary Egg!'
    }
  }
];

export const checkMilestones = (
  metrics: Record<string, DailyMetrics>,
  unlockedMilestones: UnlockedMilestone[]
): Milestone[] => {
  const unlockedIds = new Set(unlockedMilestones.map(m => m.milestoneId));
  
  return MILESTONES.filter(milestone => {
    if (unlockedIds.has(milestone.id)) return false;
    return milestone.checkCondition(metrics);
  });
};
