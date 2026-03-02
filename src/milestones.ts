import { DailyMetrics, CaughtPokemon, Pokemon } from './types';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  badge: string; // Emoji
  checkCondition: (metrics: Record<string, DailyMetrics>) => boolean;
  reward: {
    pokemon: Pokemon;
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
      pokemon: {
        id: 'machamp',
        name: 'Machamp',
        rarity: 'epic',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png'
      },
      message: 'Your dedication to deep work has summoned Machamp, the ultimate productivity champion!'
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
      pokemon: {
        id: 'pidgeot',
        name: 'Pidgeot',
        rarity: 'rare',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png'
      },
      message: 'Your early morning discipline has attracted Pidgeot, the dawn guardian!'
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
      pokemon: {
        id: 'meowth',
        name: 'Meowth',
        rarity: 'rare',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png'
      },
      message: 'Your sales mastery has attracted Meowth, the coin collector!'
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
      pokemon: {
        id: 'lapras',
        name: 'Lapras',
        rarity: 'epic',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png'
      },
      message: 'Your resilience to cold has summoned Lapras, the ice guardian!'
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
      pokemon: {
        id: 'porygon',
        name: 'Porygon',
        rarity: 'epic',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png'
      },
      message: 'Your content creation prowess has materialized Porygon, the digital master!'
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
      pokemon: {
        id: 'ditto',
        name: 'Ditto',
        rarity: 'epic',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      message: 'Your perfect consistency has attracted Ditto, the transformation master!'
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
      pokemon: {
        id: 'alakazam',
        name: 'Alakazam',
        rarity: 'epic',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png'
      },
      message: 'Your networking genius has summoned Alakazam, the connection master!'
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
      pokemon: {
        id: 'hitmonlee',
        name: 'Hitmonlee',
        rarity: 'rare',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/106.png'
      },
      message: 'Your fitness dedication has attracted Hitmonlee, the kicking master!'
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
      pokemon: {
        id: 'mr-mime',
        name: 'Mr. Mime',
        rarity: 'rare',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png'
      },
      message: 'Your persuasion skills have attracted Mr. Mime, the communication expert!'
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
      pokemon: {
        id: 'meditite',
        name: 'Meditite',
        rarity: 'rare',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/307.png'
      },
      message: 'Your mindfulness practice has attracted Meditite, the meditation master!'
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
      pokemon: {
        id: 'dragonite',
        name: 'Dragonite',
        rarity: 'legendary',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png'
      },
      message: 'Your legendary dedication has summoned Dragonite, the ultimate champion!'
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
