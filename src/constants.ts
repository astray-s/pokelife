
import { Pokemon, Quest, HabitDefinition } from './types';

export const DEFAULT_BUSINESS_HABITS: HabitDefinition[] = [
  { id: 'workHours', label: 'Hours Worked', type: 'number', xpValue: 20, step: '0.5', sprite: 68 },
  { id: 'discoveryCalls', label: 'Discovery Calls', type: 'number', xpValue: 40, sprite: 81 },
  { id: 'deliveryCalls', label: 'Delivery Calls', type: 'number', xpValue: 35, sprite: 242 },
  { id: 'networkingCalls', label: 'Networking Calls', type: 'number', xpValue: 30, sprite: 441 },
  { id: 'salesCalls', label: 'Sales Calls', type: 'number', xpValue: 50, sprite: 52 },
  { id: 'firstDmsSent', label: 'First DMs Sent', type: 'number', xpValue: 10, sprite: 16 },
  { id: 'followUpsSent', label: 'Follow-ups Sent', type: 'number', xpValue: 10, sprite: 7 },
  { id: 'commentingMinutes', label: 'Commenting (Mins)', type: 'number', xpValue: 2, sprite: 199 },
  { id: 'postsCreated', label: 'Posts Created', type: 'number', xpValue: 20, sprite: 235 },
  { id: 'postsPosted', label: 'Posts Posted', type: 'number', xpValue: 30, sprite: 149 },
  { id: 'callsBooked', label: 'Calls Booked', type: 'number', xpValue: 50, sprite: 113 },
  { id: 'callsTaken', label: 'Calls Taken', type: 'number', xpValue: 40, sprite: 242 },
];

export const DEFAULT_HEALTH_HABITS: HabitDefinition[] = [
  { id: 'timeAsleep', label: 'Time Asleep (PM)', type: 'number', xpValue: 30, min: 0, max: 11, sprite: 143 },
  { id: 'timeAwake', label: 'Time Awake (AM)', type: 'number', xpValue: 30, min: 0, max: 11, sprite: 17 },
  { id: 'coldShowers', label: 'Cold Showers', type: 'number', xpValue: 15, sprite: 87 },
  { id: 'fastHours', label: 'Fast (Hours)', type: 'number', xpValue: 3, step: '0.5', sprite: 143 },
  { id: 'exerciseType', label: 'Exercise Type', type: 'dropdown', xpValue: 60, options: ['none', 'upper', 'lower', 'cardio'], sprite: 68 },
  { id: 'foodTracking', label: 'Food Tracking', type: 'boolean', xpValue: 25, sprite: 132 },
];

export const DEFAULT_TRAINER_BOOSTS: HabitDefinition[] = [
  { id: 'affirmations', label: 'Affirmations', type: 'boolean', xpValue: 15, sprite: 122 },
  { id: 'visualizations', label: 'Visualizations', type: 'boolean', xpValue: 15, sprite: 96 },
  { id: 'planTomorrow', label: 'Plan Tomorrow', type: 'boolean', xpValue: 15, sprite: 233 },
  { id: 'storyList', label: 'Story List', type: 'boolean', xpValue: 15, sprite: 83 },
  { id: 'journal', label: 'Journal', type: 'boolean', xpValue: 20, sprite: 102 },
];

export const DEFAULT_STATUS_EFFECTS: HabitDefinition[] = [
  { id: 'youtube', label: 'YouTube', type: 'boolean', xpValue: 5, sprite: 94, isNegative: true },
  { id: 'reels', label: 'Reels', type: 'boolean', xpValue: 5, sprite: 92, isNegative: true },
  { id: 'shorts', label: 'Shorts', type: 'boolean', xpValue: 5, sprite: 93, isNegative: true },
  { id: 'processedFood', label: 'Processed Food', type: 'boolean', xpValue: 5, sprite: 88, isNegative: true },
  { id: 'gaming', label: 'Gaming', type: 'boolean', xpValue: 5, sprite: 137, isNegative: true },
];

export const POKEMON_POOLS: { uncommon: Pokemon[], rare: Pokemon[], epic: Pokemon[], legendary: Pokemon[] } = {
  uncommon: [
    { id: 'pidgey', name: 'Pidgey', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png' },
    { id: 'rattata', name: 'Rattata', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png' },
    { id: 'caterpie', name: 'Caterpie', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png' },
    { id: 'weedle', name: 'Weedle', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png' },
    { id: 'zubat', name: 'Zubat', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png' },
    { id: 'magikarp', name: 'Magikarp', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png' },
  ],
  rare: [
    { id: 'pikachu', name: 'Pikachu', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
    { id: 'eevee', name: 'Eevee', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png' },
    { id: 'snorlax', name: 'Snorlax', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png' },
    { id: 'bulbasaur', name: 'Bulbasaur', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
    { id: 'charmander', name: 'Charmander', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
    { id: 'squirtle', name: 'Squirtle', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
  ],
  epic: [
    { id: 'dragonite', name: 'Dragonite', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' },
    { id: 'lapras', name: 'Lapras', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' },
    { id: 'gyarados', name: 'Gyarados', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png' },
    { id: 'arcanine', name: 'Arcanine', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png' },
  ],
  legendary: [
    { id: 'mewtwo', name: 'Mewtwo', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png' },
    { id: 'mew', name: 'Mew', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png' },
    { id: 'articuno', name: 'Articuno', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png' },
    { id: 'zapdos', name: 'Zapdos', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png' },
    { id: 'moltres', name: 'Moltres', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png' },
  ]
};

export const DAILY_QUEST_TEMPLATES = [
  // BUSINESS - Level 0-5 (Easy)
  { name: 'Warm-up Hours', description: 'Work for at least 2 hours.', requirements: [{ metric: 'workHours', gte: 2 }], baseXPReward: 30, minLevel: 0, maxLevel: 5 },
  { name: 'First Contact', description: 'Send 2 first DMs.', requirements: [{ metric: 'firstDmsSent', gte: 2 }], baseXPReward: 25, minLevel: 0, maxLevel: 5 },
  { name: 'Social Presence', description: 'Create 1 post.', requirements: [{ metric: 'postsCreated', gte: 1 }], baseXPReward: 30, minLevel: 0, maxLevel: 5 },
  { name: 'Discovery Spark', description: 'Take 1 discovery call.', requirements: [{ metric: 'discoveryCalls', gte: 1 }], baseXPReward: 40, minLevel: 0, maxLevel: 5 },
  
  // HEALTH - Level 0-5 (Easy)
  { name: 'Early Bird', description: 'Wake up by 5 AM.', requirements: [{ metric: 'timeAwake', lte: 5 }], baseXPReward: 30, minLevel: 0, maxLevel: 5 },
  { name: 'Cold Plunge', description: 'Take 1 cold shower.', requirements: [{ metric: 'coldShowers', gte: 1 }], baseXPReward: 25, minLevel: 0, maxLevel: 5 },
  { name: 'Move Your Body', description: 'Do any exercise today.', requirements: [{ metric: 'exerciseType', gte: 1 }], baseXPReward: 35, minLevel: 0, maxLevel: 5 },
  { name: 'Nutrition Tracker', description: 'Track your food today.', requirements: [{ metric: 'foodTracking', gte: 1 }], baseXPReward: 25, minLevel: 0, maxLevel: 5 },
  
  // HABITS - Level 0-5 (Easy)
  { name: 'Morning Mindset', description: 'Do affirmations today.', requirements: [{ metric: 'affirmations', gte: 1 }], baseXPReward: 20, minLevel: 0, maxLevel: 5 },
  { name: 'Vision Quest', description: 'Do visualizations today.', requirements: [{ metric: 'visualizations', gte: 1 }], baseXPReward: 20, minLevel: 0, maxLevel: 5 },
  { name: 'Plan Ahead', description: 'Plan tomorrow today.', requirements: [{ metric: 'planTomorrow', gte: 1 }], baseXPReward: 20, minLevel: 0, maxLevel: 5 },
  { name: 'Reflection Time', description: 'Journal today.', requirements: [{ metric: 'journal', gte: 1 }], baseXPReward: 25, minLevel: 0, maxLevel: 5 },
  
  // BUSINESS - Level 6-12 (Medium)
  { name: 'Deep Work Session', description: 'Work for at least 5 hours.', requirements: [{ metric: 'workHours', gte: 5 }], baseXPReward: 60, minLevel: 6, maxLevel: 12 },
  { name: 'Outreach Sprint', description: 'Send 5 first DMs.', requirements: [{ metric: 'firstDmsSent', gte: 5 }], baseXPReward: 50, minLevel: 6, maxLevel: 12 },
  { name: 'Content Creator', description: 'Post 2 times today.', requirements: [{ metric: 'postsPosted', gte: 2 }], baseXPReward: 70, minLevel: 6, maxLevel: 12 },
  { name: 'Sales Hustle', description: 'Book at least 1 call.', requirements: [{ metric: 'callsBooked', gte: 1 }], baseXPReward: 80, minLevel: 6, maxLevel: 12 },
  { name: 'Call Warrior', description: 'Take at least 3 total calls.', requirements: [{ metric: 'callsTaken', gte: 3 }], baseXPReward: 75, minLevel: 6, maxLevel: 12 },
  
  // HEALTH - Level 6-12 (Medium)
  { name: 'Sleep Champion', description: 'Sleep by 9 PM and wake by 5 AM.', requirements: [{ metric: 'timeAsleep', lte: 21 }, { metric: 'timeAwake', lte: 5 }], baseXPReward: 60, minLevel: 6, maxLevel: 12 },
  { name: 'Ice Bath Warrior', description: 'Take 2 cold showers.', requirements: [{ metric: 'coldShowers', gte: 2 }], baseXPReward: 50, minLevel: 6, maxLevel: 12 },
  { name: 'Fasting Master', description: 'Fast for 16 hours.', requirements: [{ metric: 'fastHours', gte: 16 }], baseXPReward: 55, minLevel: 6, maxLevel: 12 },
  { name: 'Wellness Combo', description: 'Exercise and track food.', requirements: [{ metric: 'exerciseType', gte: 1 }, { metric: 'foodTracking', gte: 1 }], baseXPReward: 65, minLevel: 6, maxLevel: 12 },
  
  // HABITS - Level 6-12 (Medium)
  { name: 'Morning Ritual', description: 'Do affirmations and visualizations.', requirements: [{ metric: 'affirmations', gte: 1 }, { metric: 'visualizations', gte: 1 }], baseXPReward: 45, minLevel: 6, maxLevel: 12 },
  { name: 'Planning Pro', description: 'Plan tomorrow and make story list.', requirements: [{ metric: 'planTomorrow', gte: 1 }, { metric: 'storyList', gte: 1 }], baseXPReward: 40, minLevel: 6, maxLevel: 12 },
  { name: 'Full Routine', description: 'Complete all 5 daily habits.', requirements: [{ metric: 'affirmations', gte: 1 }, { metric: 'visualizations', gte: 1 }, { metric: 'planTomorrow', gte: 1 }, { metric: 'storyList', gte: 1 }, { metric: 'journal', gte: 1 }], baseXPReward: 80, minLevel: 6, maxLevel: 12 },
  
  // STATUS EFFECTS - Level 6-12 (Medium)
  { name: 'Digital Detox', description: 'Avoid all social media today.', requirements: [{ metric: 'youtube', lte: 0 }, { metric: 'reels', lte: 0 }, { metric: 'shorts', lte: 0 }], baseXPReward: 70, minLevel: 6, maxLevel: 12 },
  { name: 'Clean Eating', description: 'No processed food today.', requirements: [{ metric: 'processedFood', lte: 0 }], baseXPReward: 50, minLevel: 6, maxLevel: 12 },
  
  // BUSINESS - Level 13+ (Hard)
  { name: 'CEO Grind', description: 'Work for at least 8 hours.', requirements: [{ metric: 'workHours', gte: 8 }], baseXPReward: 120, minLevel: 13 },
  { name: 'Outreach Overlord', description: 'Send 10 first DMs.', requirements: [{ metric: 'firstDmsSent', gte: 10 }], baseXPReward: 100, minLevel: 13 },
  { name: 'Content Machine', description: 'Post 3 times today.', requirements: [{ metric: 'postsPosted', gte: 3 }], baseXPReward: 150, minLevel: 13 },
  { name: 'Sales Closer', description: 'Take 2 sales calls.', requirements: [{ metric: 'salesCalls', gte: 2 }], baseXPReward: 180, minLevel: 13 },
  { name: 'Networking Pro', description: 'Take 2 networking calls.', requirements: [{ metric: 'networkingCalls', gte: 2 }], baseXPReward: 140, minLevel: 13 },
  
  // HEALTH - Level 13+ (Hard)
  { name: 'Health Perfectionist', description: 'Sleep by 9 PM, wake by 5 AM, cold shower, exercise, track food.', requirements: [{ metric: 'timeAsleep', lte: 21 }, { metric: 'timeAwake', lte: 5 }, { metric: 'coldShowers', gte: 1 }, { metric: 'exerciseType', gte: 1 }, { metric: 'foodTracking', gte: 1 }], baseXPReward: 200, minLevel: 13 },
  { name: 'Fasting Legend', description: 'Fast for 20 hours.', requirements: [{ metric: 'fastHours', gte: 20 }], baseXPReward: 120, minLevel: 13 },
  { name: 'Ice Bath Master', description: 'Take 3 cold showers.', requirements: [{ metric: 'coldShowers', gte: 3 }], baseXPReward: 100, minLevel: 13 },
  
  // HABITS - Level 13+ (Hard)
  { name: 'Perfect Day', description: 'Complete all habits and avoid all bad habits.', requirements: [{ metric: 'affirmations', gte: 1 }, { metric: 'visualizations', gte: 1 }, { metric: 'planTomorrow', gte: 1 }, { metric: 'storyList', gte: 1 }, { metric: 'journal', gte: 1 }, { metric: 'youtube', lte: 0 }, { metric: 'reels', lte: 0 }, { metric: 'shorts', lte: 0 }, { metric: 'processedFood', lte: 0 }, { metric: 'gaming', lte: 0 }], baseXPReward: 250, minLevel: 13 },
  
  // STATUS EFFECTS - Level 13+ (Hard)
  { name: 'Zero Distractions', description: 'Avoid all bad habits today.', requirements: [{ metric: 'youtube', lte: 0 }, { metric: 'reels', lte: 0 }, { metric: 'shorts', lte: 0 }, { metric: 'processedFood', lte: 0 }, { metric: 'gaming', lte: 0 }], baseXPReward: 150, minLevel: 13 },
];

export const WEEKLY_QUEST_TEMPLATES = [
  // BUSINESS
  { name: 'Workhorse', description: 'Work 40 hours this week.', requirements: [{ metric: 'workHours', gte: 40 }], baseXPReward: 300 },
  { name: 'Sales Machine', description: 'Book 5 calls this week.', requirements: [{ metric: 'callsBooked', gte: 5 }], baseXPReward: 400 },
  { name: 'Consistency King', description: 'Post 15 times this week.', requirements: [{ metric: 'postsPosted', gte: 15 }], baseXPReward: 450 },
  { name: 'Outreach Legend', description: 'Send 30 outreach DMs this week.', requirements: [{ metric: 'firstDmsSent', gte: 30 }], baseXPReward: 500 },
  { name: 'Engagement Legend', description: 'Spend 200 mins commenting this week.', requirements: [{ metric: 'commentingMinutes', gte: 200 }], baseXPReward: 350 },
  
  // HEALTH
  { name: 'Early Riser', description: 'Wake by 5 AM for 5 days.', requirements: [{ metric: 'timeAwake', lte: 35 }], baseXPReward: 400 },
  { name: 'Cold Therapy', description: 'Take 10 cold showers this week.', requirements: [{ metric: 'coldShowers', gte: 10 }], baseXPReward: 350 },
  { name: 'Fitness Warrior', description: 'Exercise 5 times this week.', requirements: [{ metric: 'exerciseType', gte: 5 }], baseXPReward: 450 },
  { name: 'Nutrition Master', description: 'Track food 7 days this week.', requirements: [{ metric: 'foodTracking', gte: 7 }], baseXPReward: 400 },
  
  // HABITS
  { name: 'Mindset Master', description: 'Do affirmations 7 days this week.', requirements: [{ metric: 'affirmations', gte: 7 }], baseXPReward: 350 },
  { name: 'Vision Keeper', description: 'Do visualizations 7 days this week.', requirements: [{ metric: 'visualizations', gte: 7 }], baseXPReward: 350 },
  { name: 'Planning Expert', description: 'Plan tomorrow 7 days this week.', requirements: [{ metric: 'planTomorrow', gte: 7 }], baseXPReward: 350 },
  { name: 'Journal Warrior', description: 'Journal 7 days this week.', requirements: [{ metric: 'journal', gte: 7 }], baseXPReward: 400 },
  
  // STATUS EFFECTS
  { name: 'Social Media Free', description: 'Avoid all social media for 7 days.', requirements: [{ metric: 'youtube', lte: 0 }, { metric: 'reels', lte: 0 }, { metric: 'shorts', lte: 0 }], baseXPReward: 500 },
  { name: 'Clean Week', description: 'No processed food for 7 days.', requirements: [{ metric: 'processedFood', lte: 0 }], baseXPReward: 450 },
];

export const BOSS_DATA = [
  // Big Bosses (Weekly)
  { name: 'Gym Leader Brock', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png', type: 'big' as const },
  { name: 'Gym Leader Misty', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png', type: 'big' as const },
  { name: 'Gym Leader Lt. Surge', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png', type: 'big' as const },
  { name: 'Gym Leader Erika', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png', type: 'big' as const },
  { name: 'Gym Leader Koga', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/169.png', type: 'big' as const },
  { name: 'Gym Leader Sabrina', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png', type: 'big' as const },
  { name: 'Gym Leader Blaine', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png', type: 'big' as const },
  { name: 'Gym Leader Giovanni', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png', type: 'big' as const },
];

export const MINI_BOSS_DATA = [
  // Mini Bosses (Daily)
  { name: 'Team Rocket Grunt', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png', type: 'mini' as const }, // Raticate
  { name: 'Bug Catcher', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png', type: 'mini' as const }, // Beedrill
  { name: 'Youngster', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png', type: 'mini' as const }, // Rattata
  { name: 'Lass', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png', type: 'mini' as const }, // Clefairy
  { name: 'Hiker', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png', type: 'mini' as const }, // Geodude
  { name: 'Fisherman', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png', type: 'mini' as const }, // Magikarp
  { name: 'Swimmer', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png', type: 'mini' as const }, // Tentacool
  { name: 'Picnicker', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png', type: 'mini' as const }, // Oddish
  { name: 'Camper', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png', type: 'mini' as const }, // Growlithe
  { name: 'Beauty', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png', type: 'mini' as const }, // Meowth
  { name: 'Rocket Admin', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/110.png', type: 'mini' as const }, // Weezing
  { name: 'Ace Trainer', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png', type: 'mini' as const }, // Ninetales
];

export const BOSS_NAMES = BOSS_DATA.map(b => b.name);
export const MINI_BOSS_NAMES = MINI_BOSS_DATA.map(b => b.name);

export const METRIC_KEYS = [
  // Main Attacks (Business)
  'workHours', 'discoveryCalls', 'deliveryCalls', 'networkingCalls', 'salesCalls', 'firstDmsSent', 'followUpsSent', 
  'commentingMinutes', 'postsCreated', 'postsPosted', 'callsBooked', 'callsTaken',
  // Special Moves (Health)
  'timeAsleep', 'timeAwake', 'coldShowers', 'fastHours', 'exerciseType', 'foodTracking',
  // Trainer Boosts (Daily Habits)
  'affirmations', 'visualizations', 'planTomorrow', 'storyList', 'journal',
  // Status Effects (Bad Habits)
  'youtube', 'reels', 'shorts', 'processedFood', 'gaming'
] as const;
