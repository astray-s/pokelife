import { Rarity, Pokemon, CaughtPokemon } from './types';
import { generatePokemonCharacteristics } from './pokemonCharacteristics';

export interface Egg {
  id: string;
  rarity: Rarity;
  obtainedAt: string;
  source: string; // 'quest', 'boss', 'milestone', 'threshold', 'daily', 'levelup'
}

// Expanded Pokemon pool from Kanto to Kalos (Generations 1-6)
export const EXPANDED_POKEMON_POOLS: { uncommon: Pokemon[], rare: Pokemon[], epic: Pokemon[], legendary: Pokemon[] } = {
  uncommon: [
    // Kanto (Gen 1)
    { id: 'pidgey', name: 'Pidgey', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png' },
    { id: 'rattata', name: 'Rattata', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png' },
    { id: 'spearow', name: 'Spearow', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png' },
    { id: 'ekans', name: 'Ekans', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png' },
    { id: 'sandshrew', name: 'Sandshrew', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png' },
    { id: 'zubat', name: 'Zubat', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png' },
    { id: 'oddish', name: 'Oddish', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png' },
    { id: 'meowth', name: 'Meowth', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png' },
    { id: 'psyduck', name: 'Psyduck', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png' },
    { id: 'poliwag', name: 'Poliwag', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png' },
    { id: 'magikarp', name: 'Magikarp', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png' },
    
    // Johto (Gen 2)
    { id: 'sentret', name: 'Sentret', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/161.png' },
    { id: 'hoothoot', name: 'Hoothoot', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/163.png' },
    { id: 'ledyba', name: 'Ledyba', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/165.png' },
    { id: 'spinarak', name: 'Spinarak', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/167.png' },
    
    // Hoenn (Gen 3)
    { id: 'poochyena', name: 'Poochyena', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/261.png' },
    { id: 'zigzagoon', name: 'Zigzagoon', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/263.png' },
    { id: 'wurmple', name: 'Wurmple', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/265.png' },
    { id: 'taillow', name: 'Taillow', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/276.png' },
    
    // Sinnoh (Gen 4)
    { id: 'starly', name: 'Starly', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/396.png' },
    { id: 'bidoof', name: 'Bidoof', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/399.png' },
    { id: 'kricketot', name: 'Kricketot', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/401.png' },
    
    // Unova (Gen 5)
    { id: 'patrat', name: 'Patrat', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/504.png' },
    { id: 'lillipup', name: 'Lillipup', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/506.png' },
    { id: 'purrloin', name: 'Purrloin', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/509.png' },
    
    // Kalos (Gen 6)
    { id: 'bunnelby', name: 'Bunnelby', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/659.png' },
    { id: 'fletchling', name: 'Fletchling', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/661.png' },
    { id: 'scatterbug', name: 'Scatterbug', rarity: 'uncommon', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/664.png' },
  ],
  rare: [
    // Kanto
    { id: 'pikachu', name: 'Pikachu', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
    { id: 'vulpix', name: 'Vulpix', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png' },
    { id: 'jigglypuff', name: 'Jigglypuff', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png' },
    { id: 'growlithe', name: 'Growlithe', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png' },
    { id: 'abra', name: 'Abra', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png' },
    { id: 'machop', name: 'Machop', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png' },
    { id: 'gastly', name: 'Gastly', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png' },
    { id: 'eevee', name: 'Eevee', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png' },
    { id: 'snorlax', name: 'Snorlax', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png' },
    { id: 'dratini', name: 'Dratini', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png' },
    
    // Johto
    { id: 'cyndaquil', name: 'Cyndaquil', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png' },
    { id: 'totodile', name: 'Totodile', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png' },
    { id: 'mareep', name: 'Mareep', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/179.png' },
    { id: 'togepi', name: 'Togepi', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/175.png' },
    
    // Hoenn
    { id: 'treecko', name: 'Treecko', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/252.png' },
    { id: 'torchic', name: 'Torchic', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png' },
    { id: 'mudkip', name: 'Mudkip', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/258.png' },
    { id: 'ralts', name: 'Ralts', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/280.png' },
    { id: 'aron', name: 'Aron', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/304.png' },
    { id: 'bagon', name: 'Bagon', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/371.png' },
    
    // Sinnoh
    { id: 'chimchar', name: 'Chimchar', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/390.png' },
    { id: 'piplup', name: 'Piplup', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png' },
    { id: 'riolu', name: 'Riolu', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/447.png' },
    { id: 'gible', name: 'Gible', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/443.png' },
    
    // Unova
    { id: 'oshawott', name: 'Oshawott', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/501.png' },
    { id: 'tepig', name: 'Tepig', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/498.png' },
    { id: 'snivy', name: 'Snivy', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/495.png' },
    { id: 'zorua', name: 'Zorua', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/570.png' },
    
    // Kalos
    { id: 'froakie', name: 'Froakie', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/656.png' },
    { id: 'fennekin', name: 'Fennekin', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/653.png' },
    { id: 'chespin', name: 'Chespin', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/650.png' },
    { id: 'honedge', name: 'Honedge', rarity: 'rare', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/679.png' },
  ],
  epic: [
    // Kanto
    { id: 'charizard', name: 'Charizard', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
    { id: 'blastoise', name: 'Blastoise', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png' },
    { id: 'venusaur', name: 'Venusaur', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png' },
    { id: 'arcanine', name: 'Arcanine', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png' },
    { id: 'alakazam', name: 'Alakazam', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png' },
    { id: 'machamp', name: 'Machamp', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png' },
    { id: 'gengar', name: 'Gengar', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png' },
    { id: 'gyarados', name: 'Gyarados', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png' },
    { id: 'lapras', name: 'Lapras', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' },
    { id: 'dragonite', name: 'Dragonite', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' },
    
    // Johto
    { id: 'typhlosion', name: 'Typhlosion', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/157.png' },
    { id: 'feraligatr', name: 'Feraligatr', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/160.png' },
    { id: 'ampharos', name: 'Ampharos', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/181.png' },
    { id: 'tyranitar', name: 'Tyranitar', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png' },
    
    // Hoenn
    { id: 'blaziken', name: 'Blaziken', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/257.png' },
    { id: 'swampert', name: 'Swampert', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png' },
    { id: 'gardevoir', name: 'Gardevoir', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png' },
    { id: 'aggron', name: 'Aggron', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/306.png' },
    { id: 'metagross', name: 'Metagross', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/376.png' },
    { id: 'salamence', name: 'Salamence', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/373.png' },
    
    // Sinnoh
    { id: 'infernape', name: 'Infernape', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png' },
    { id: 'empoleon', name: 'Empoleon', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/395.png' },
    { id: 'lucario', name: 'Lucario', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png' },
    { id: 'garchomp', name: 'Garchomp', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png' },
    
    // Unova
    { id: 'samurott', name: 'Samurott', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/503.png' },
    { id: 'serperior', name: 'Serperior', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/497.png' },
    { id: 'zoroark', name: 'Zoroark', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/571.png' },
    { id: 'hydreigon', name: 'Hydreigon', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/635.png' },
    
    // Kalos
    { id: 'greninja', name: 'Greninja', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png' },
    { id: 'delphox', name: 'Delphox', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/655.png' },
    { id: 'chesnaught', name: 'Chesnaught', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/652.png' },
    { id: 'aegislash', name: 'Aegislash', rarity: 'epic', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/681.png' },
  ],
  legendary: [
    // Kanto
    { id: 'articuno', name: 'Articuno', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png' },
    { id: 'zapdos', name: 'Zapdos', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png' },
    { id: 'moltres', name: 'Moltres', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png' },
    { id: 'mewtwo', name: 'Mewtwo', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png' },
    { id: 'mew', name: 'Mew', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png' },
    
    // Johto
    { id: 'raikou', name: 'Raikou', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png' },
    { id: 'entei', name: 'Entei', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png' },
    { id: 'suicune', name: 'Suicune', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png' },
    { id: 'lugia', name: 'Lugia', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png' },
    { id: 'ho-oh', name: 'Ho-Oh', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png' },
    
    // Hoenn
    { id: 'regirock', name: 'Regirock', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/377.png' },
    { id: 'regice', name: 'Regice', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/378.png' },
    { id: 'registeel', name: 'Registeel', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/379.png' },
    { id: 'latias', name: 'Latias', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/380.png' },
    { id: 'latios', name: 'Latios', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/381.png' },
    { id: 'kyogre', name: 'Kyogre', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/382.png' },
    { id: 'groudon', name: 'Groudon', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/383.png' },
    { id: 'rayquaza', name: 'Rayquaza', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png' },
    
    // Sinnoh
    { id: 'uxie', name: 'Uxie', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/480.png' },
    { id: 'mesprit', name: 'Mesprit', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/481.png' },
    { id: 'azelf', name: 'Azelf', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/482.png' },
    { id: 'dialga', name: 'Dialga', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/483.png' },
    { id: 'palkia', name: 'Palkia', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/484.png' },
    { id: 'giratina', name: 'Giratina', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/487.png' },
    
    // Unova
    { id: 'cobalion', name: 'Cobalion', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/638.png' },
    { id: 'terrakion', name: 'Terrakion', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/639.png' },
    { id: 'virizion', name: 'Virizion', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/640.png' },
    { id: 'reshiram', name: 'Reshiram', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/643.png' },
    { id: 'zekrom', name: 'Zekrom', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/644.png' },
    { id: 'kyurem', name: 'Kyurem', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/646.png' },
    
    // Kalos
    { id: 'xerneas', name: 'Xerneas', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/716.png' },
    { id: 'yveltal', name: 'Yveltal', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/717.png' },
    { id: 'zygarde', name: 'Zygarde', rarity: 'legendary', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/718.png' },
  ]
};

export const getEggColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'uncommon': return '#94a3b8'; // Gray
    case 'rare': return '#3b82f6'; // Blue
    case 'epic': return '#a855f7'; // Purple
    case 'legendary': return '#f59e0b'; // Gold
  }
};

export const getEggGradient = (rarity: Rarity): string => {
  switch (rarity) {
    case 'uncommon': return 'from-slate-300 to-slate-400';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-orange-500';
  }
};

export const hatchEgg = (egg: Egg): { pokemon: CaughtPokemon; isShiny: boolean } => {
  const pool = EXPANDED_POKEMON_POOLS[egg.rarity];
  const basePokemon = pool[Math.floor(Math.random() * pool.length)];
  
  // Shiny chance: 1% base, 5% for legendary eggs
  const shinyChance = egg.rarity === 'legendary' ? 0.05 : 0.01;
  const isShiny = Math.random() < shinyChance;
  
  // Generate characteristics
  const pokemonWithCharacteristics = generatePokemonCharacteristics(basePokemon, isShiny);
  
  // Create the caught Pokemon with instance ID and caught date
  const caughtPokemon: CaughtPokemon = {
    ...pokemonWithCharacteristics,
    instanceId: Math.random().toString(36).substr(2, 9),
    caughtAt: new Date().toISOString()
  };
  
  return { pokemon: caughtPokemon, isShiny };
};
