import { Pokemon, CaughtPokemon } from './types';

// Pokemon natures (from actual Pokemon games)
const NATURES = [
  'Adamant', 'Bashful', 'Bold', 'Brave', 'Calm',
  'Careful', 'Docile', 'Gentle', 'Hardy', 'Hasty',
  'Impish', 'Jolly', 'Lax', 'Lonely', 'Mild',
  'Modest', 'Naive', 'Naughty', 'Quiet', 'Quirky',
  'Rash', 'Relaxed', 'Sassy', 'Serious', 'Timid'
];

// Characteristics
const CHARACTERISTICS = [
  'Loves to eat',
  'Takes plenty of siestas',
  'Nods off a lot',
  'Scatters things often',
  'Likes to relax',
  'Proud of its power',
  'Likes to thrash about',
  'A little quick tempered',
  'Likes to fight',
  'Quick tempered',
  'Sturdy body',
  'Capable of taking hits',
  'Highly persistent',
  'Good endurance',
  'Good perseverance',
  'Highly curious',
  'Mischievous',
  'Thoroughly cunning',
  'Often lost in thought',
  'Very finicky',
  'Strong willed',
  'Somewhat vain',
  'Strongly defiant',
  'Hates to lose',
  'Somewhat stubborn',
  'Alert to sounds',
  'Impetuous and silly',
  'Somewhat of a clown',
  'Quick to flee',
  'Highly strung'
];

// Favorite foods
const FAVORITE_FOODS = [
  'Berries', 'Poffins', 'Curry', 'Sandwiches', 'Malasadas',
  'Sweet treats', 'Spicy food', 'Bitter herbs', 'Sour candies',
  'Dry crackers', 'Fresh fruit', 'Grilled fish', 'Roasted nuts',
  'Honey', 'Chocolate', 'Ice cream', 'Pizza', 'Ramen',
  'Sushi', 'Tacos', 'Burgers', 'Salad', 'Soup'
];

// Personality traits
const PERSONALITIES = [
  'Energetic and playful',
  'Calm and collected',
  'Shy but friendly',
  'Bold and adventurous',
  'Lazy but lovable',
  'Curious about everything',
  'Protective of trainer',
  'Independent spirit',
  'Loves attention',
  'Prefers solitude',
  'Always hungry',
  'Sleeps a lot',
  'Loves to battle',
  'Avoids conflict',
  'Mischievous prankster',
  'Gentle and caring',
  'Competitive nature',
  'Easygoing attitude',
  'Perfectionist',
  'Free-spirited',
  'Loyal companion',
  'Stubborn streak',
  'Quick learner',
  'Slow but steady',
  'Dramatic flair'
];

// Base heights and weights for common Pokemon (in meters and kg)
// These are rough averages - we'll add variation
const BASE_STATS: Record<string, { height: number; weight: number }> = {
  // Kanto starters
  'bulbasaur': { height: 0.7, weight: 6.9 },
  'charmander': { height: 0.6, weight: 8.5 },
  'squirtle': { height: 0.5, weight: 9.0 },
  'pikachu': { height: 0.4, weight: 6.0 },
  'eevee': { height: 0.3, weight: 6.5 },
  
  // Default for unknown Pokemon
  'default': { height: 0.8, weight: 15.0 }
};

// Generate random characteristics for a caught Pokemon
export function generatePokemonCharacteristics(basePokemon: Pokemon, isShiny: boolean): Omit<CaughtPokemon, 'instanceId' | 'caughtAt'> {
  // Get base stats or use default
  const baseStats = BASE_STATS[basePokemon.id.toLowerCase()] || BASE_STATS['default'];
  
  // Add random variation to height and weight (-20% to +20%)
  const heightVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  const weightVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  
  const height = Math.round(baseStats.height * heightVariation * 100) / 100; // Round to 2 decimals
  const weight = Math.round(baseStats.weight * weightVariation * 10) / 10; // Round to 1 decimal
  
  // Randomly select characteristics
  const nature = NATURES[Math.floor(Math.random() * NATURES.length)];
  const characteristic = CHARACTERISTICS[Math.floor(Math.random() * CHARACTERISTICS.length)];
  const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
  
  return {
    ...basePokemon,
    isShiny,
    height,
    weight,
    nature,
    characteristic,
    personality
  };
}

// Get a Pokedex-style entry about the Pokemon
export function getPokemonEntry(pokemon: CaughtPokemon): string {
  const entries = [
    `This ${pokemon.name} measures ${pokemon.height}m in height and weighs ${pokemon.weight}kg. Known for being ${pokemon.personality.toLowerCase()}.`,
    `A ${pokemon.nature} natured ${pokemon.name} that ${pokemon.characteristic.toLowerCase()}. Stands at ${pokemon.height}m tall.`,
    `Height: ${pokemon.height}m, Weight: ${pokemon.weight}kg. This ${pokemon.name} has a ${pokemon.nature} nature and is ${pokemon.personality.toLowerCase()}.`,
    `This specimen is ${getSizeCategory(pokemon.height).toLowerCase()} for its species at ${pokemon.height}m. ${pokemon.characteristic}.`,
    `Weighing ${pokemon.weight}kg, this ${pokemon.name} is ${getWeightCategory(pokemon.weight).toLowerCase()}. It ${pokemon.characteristic.toLowerCase()}.`
  ];
  
  return entries[Math.floor(Math.random() * entries.length)];
}

// Get size category
export function getSizeCategory(height: number): string {
  if (height < 0.5) return 'Tiny';
  if (height < 1.0) return 'Small';
  if (height < 1.5) return 'Medium';
  if (height < 2.5) return 'Large';
  return 'Huge';
}

// Get weight category
export function getWeightCategory(weight: number): string {
  if (weight < 10) return 'Light';
  if (weight < 30) return 'Average';
  if (weight < 100) return 'Heavy';
  return 'Very Heavy';
}
