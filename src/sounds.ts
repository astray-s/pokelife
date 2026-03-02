// Sound effect URLs from Pokemon games
export const SOUNDS = {
  // UI Sounds
  click: 'https://play.pokemonshowdown.com/audio/cries/pikachu.mp3',
  select: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg',
  back: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/39.ogg',
  
  // Success Sounds
  levelUp: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/6.ogg', // Charizard
  questComplete: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/151.ogg', // Mew
  taskComplete: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg', // Pikachu
  xpGain: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/133.ogg', // Eevee
  
  // Pokemon Sounds
  pokemonCatch: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/150.ogg', // Mewtwo
  evolution: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/149.ogg', // Dragonite
  shiny: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/144.ogg', // Articuno
  
  // Battle Sounds
  bossDamage: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/68.ogg', // Machamp
  bossDefeat: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/130.ogg', // Gyarados
  
  // Error/Warning
  error: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/92.ogg', // Gastly
  warning: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/94.ogg', // Gengar
};

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    // Preload common sounds
    this.preload(['click', 'select', 'taskComplete', 'xpGain']);
  }

  preload(soundKeys: string[]) {
    soundKeys.forEach(key => {
      const url = SOUNDS[key as keyof typeof SOUNDS];
      if (url && !this.sounds.has(key)) {
        const audio = new Audio(url);
        audio.volume = this.volume;
        audio.preload = 'auto';
        this.sounds.set(key, audio);
      }
    });
  }

  play(soundKey: keyof typeof SOUNDS) {
    if (!this.enabled) return;

    try {
      let audio = this.sounds.get(soundKey);
      
      if (!audio) {
        const url = SOUNDS[soundKey];
        if (!url) return;
        
        audio = new Audio(url);
        audio.volume = this.volume;
        this.sounds.set(soundKey, audio);
      }

      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    } catch (err) {
      console.log('Sound error:', err);
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.sounds.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
