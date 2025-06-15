// Local game generator that works without external APIs
// Interprets simple keywords from children's speech

export interface GameInterpretation {
  gameType: 'jumping' | 'puzzle' | 'racing' | 'creative' | 'adventure' | 'collection';
  title: string;
  description: string;
  character: string;
  objective: string;
  controls: Record<string, string>;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  elements: string[];
  encouragement: string;
}

// Predefined game templates and responses
const gameTemplates = {
  jumping: {
    titles: ['Super Jumper', 'Bouncy Adventure', 'Sky Hopper', 'Jump Quest'],
    characters: ['frog', 'bunny', 'kangaroo', 'superhero'],
    objectives: ['Jump to collect stars', 'Hop across platforms', 'Reach the top', 'Avoid obstacles'],
    themes: ['forest', 'space', 'clouds', 'playground'],
    colors: [
      { primary: '#32CD32', secondary: '#90EE90', background: '#E6FFE6' },
      { primary: '#FF69B4', secondary: '#FFB6C1', background: '#FFF0F5' },
      { primary: '#4169E1', secondary: '#87CEEB', background: '#F0F8FF' },
      { primary: '#FF6347', secondary: '#FFA07A', background: '#FFF5EE' }
    ]
  },
  
  collection: {
    titles: ['Treasure Hunt', 'Star Collector', 'Magic Gems', 'Rainbow Picker'],
    characters: ['explorer', 'fairy', 'robot', 'puppy'],
    objectives: ['Collect all the treasures', 'Gather shiny stars', 'Find hidden gems', 'Pick up colorful items'],
    themes: ['treasure island', 'magical garden', 'space station', 'candy land'],
    colors: [
      { primary: '#FFD700', secondary: '#FFA500', background: '#FFFAF0' },
      { primary: '#9370DB', secondary: '#DDA0DD', background: '#F8F0FF' },
      { primary: '#20B2AA', secondary: '#AFEEEE', background: '#F0FFFF' },
      { primary: '#DC143C', secondary: '#F08080', background: '#FFF8F8' }
    ]
  },
  
  racing: {
    titles: ['Speed Race', 'Fast Car Fun', 'Racing Adventure', 'Zoom Zoom'],
    characters: ['race car', 'motorcycle', 'spaceship', 'bicycle'],
    objectives: ['Race to the finish line', 'Be the fastest', 'Win the race', 'Dodge obstacles'],
    themes: ['race track', 'city streets', 'space highway', 'countryside'],
    colors: [
      { primary: '#FF0000', secondary: '#FF6347', background: '#FFF0F0' },
      { primary: '#0000FF', secondary: '#4169E1', background: '#F0F0FF' },
      { primary: '#FF8C00', secondary: '#FFA500', background: '#FFF8DC' },
      { primary: '#00FF00', secondary: '#32CD32', background: '#F0FFF0' }
    ]
  },
  
  puzzle: {
    titles: ['Match Magic', 'Color Puzzle', 'Memory Game', 'Picture Match'],
    characters: ['wizard', 'detective', 'smart owl', 'puzzle master'],
    objectives: ['Match all the pairs', 'Solve the puzzle', 'Find matching colors', 'Complete the picture'],
    themes: ['magical castle', 'detective office', 'school classroom', 'art studio'],
    colors: [
      { primary: '#8A2BE2', secondary: '#DA70D6', background: '#F5F0FF' },
      { primary: '#FF1493', secondary: '#FF69B4', background: '#FFF0F8' },
      { primary: '#00CED1', secondary: '#48D1CC', background: '#F0FFFF' },
      { primary: '#32CD32', secondary: '#90EE90', background: '#F0FFF0' }
    ]
  },
  
  creative: {
    titles: ['Art Master', 'Draw & Create', 'Color Fun', 'Paint Palace'],
    characters: ['artist', 'painter', 'creative fairy', 'art robot'],
    objectives: ['Create beautiful art', 'Draw anything you want', 'Make colorful pictures', 'Express yourself'],
    themes: ['art studio', 'rainbow world', 'paint factory', 'creativity land'],
    colors: [
      { primary: '#FF69B4', secondary: '#FFB6C1', background: '#FFF0F5' },
      { primary: '#9370DB', secondary: '#DDA0DD', background: '#F8F0FF' },
      { primary: '#FF6347', secondary: '#FFA07A', background: '#FFF5EE' },
      { primary: '#20B2AA', secondary: '#AFEEEE', background: '#F0FFFF' }
    ]
  },
  
  adventure: {
    titles: ['Big Adventure', 'Explore Quest', 'Hero Journey', 'Discovery Time'],
    characters: ['brave hero', 'explorer', 'adventurer', 'treasure hunter'],
    objectives: ['Explore the world', 'Find hidden treasures', 'Help friends', 'Solve mysteries'],
    themes: ['jungle', 'mysterious cave', 'enchanted forest', 'pirate island'],
    colors: [
      { primary: '#228B22', secondary: '#90EE90', background: '#F0FFF0' },
      { primary: '#8B4513', secondary: '#D2691E', background: '#FFF8DC' },
      { primary: '#4682B4', secondary: '#87CEEB', background: '#F0F8FF' },
      { primary: '#DAA520', secondary: '#F0E68C', background: '#FFFACD' }
    ]
  }
};

const encouragements = [
  "What an amazing idea! You're so creative!",
  "Wow! That sounds like a super fun game!",
  "You have such a great imagination!",
  "That's a fantastic idea! Let's build it!",
  "You're going to love playing this game!",
  "What a clever game idea! You're brilliant!",
  "This is going to be so much fun to play!",
  "You think of the coolest games ever!"
];

// Keywords that help identify game types
const gameTypeKeywords = {
  jumping: ['jump', 'hop', 'bounce', 'leap', 'platform', 'frog', 'bunny', 'kangaroo'],
  collection: ['collect', 'gather', 'pick', 'find', 'treasure', 'star', 'gem', 'coin'],
  racing: ['race', 'car', 'fast', 'speed', 'drive', 'motor', 'bike', 'zoom'],
  puzzle: ['puzzle', 'match', 'memory', 'solve', 'brain', 'think', 'pair'],
  creative: ['draw', 'paint', 'art', 'color', 'create', 'make', 'design'],
  adventure: ['adventure', 'explore', 'quest', 'hero', 'journey', 'discover']
};

// Character keywords
const characterKeywords = {
  animals: ['dog', 'cat', 'bird', 'fish', 'frog', 'bunny', 'lion', 'tiger', 'bear', 'monkey'],
  vehicles: ['car', 'truck', 'plane', 'boat', 'rocket', 'bike', 'train'],
  people: ['hero', 'princess', 'knight', 'pirate', 'wizard', 'fairy', 'robot'],
  fantasy: ['dragon', 'unicorn', 'monster', 'alien', 'ghost', 'fairy']
};

// Theme keywords
const themeKeywords = {
  nature: ['forest', 'jungle', 'ocean', 'mountain', 'garden', 'beach', 'river'],
  space: ['space', 'planet', 'star', 'moon', 'rocket', 'alien', 'galaxy'],
  fantasy: ['castle', 'magic', 'fairy', 'dragon', 'kingdom', 'enchanted'],
  everyday: ['school', 'home', 'park', 'city', 'playground', 'library']
};

function detectGameType(transcript: string): string {
  const words = transcript.toLowerCase().split(/\s+/);
  const scores: Record<string, number> = {};
  
  // Initialize scores
  Object.keys(gameTypeKeywords).forEach(type => {
    scores[type] = 0;
  });
  
  // Score based on keyword matches
  words.forEach(word => {
    Object.entries(gameTypeKeywords).forEach(([type, keywords]) => {
      if (keywords.some(keyword => word.includes(keyword) || keyword.includes(word))) {
        scores[type] += 1;
      }
    });
  });
  
  // Find the highest scoring type
  const bestType = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];
  
  // If no clear winner, default to adventure
  return scores[bestType] > 0 ? bestType : 'adventure';
}

function detectCharacter(transcript: string): string {
  const words = transcript.toLowerCase().split(/\s+/);
  
  // Look for character mentions
  for (const word of words) {
    for (const [category, characters] of Object.entries(characterKeywords)) {
      for (const character of characters) {
        if (word.includes(character) || character.includes(word)) {
          return character;
        }
      }
    }
  }
  
  return 'hero'; // default
}

function detectTheme(transcript: string): string {
  const words = transcript.toLowerCase().split(/\s+/);
  
  // Look for theme mentions
  for (const word of words) {
    for (const [category, themes] of Object.entries(themeKeywords)) {
      for (const theme of themes) {
        if (word.includes(theme) || theme.includes(word)) {
          return theme;
        }
      }
    }
  }
  
  return 'magical world'; // default
}

function getRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function interpretChildIdeaLocal(transcript: string): GameInterpretation {
  const gameType = detectGameType(transcript) as keyof typeof gameTemplates;
  const template = gameTemplates[gameType];
  
  const character = detectCharacter(transcript);
  const theme = detectTheme(transcript);
  
  const title = getRandomFromArray(template.titles);
  const objective = getRandomFromArray(template.objectives);
  const colors = getRandomFromArray(template.colors);
  const encouragement = getRandomFromArray(encouragements);
  
  // Create controls based on game type
  const controls: Record<string, string> = {};
  if (gameType === 'creative' || gameType === 'puzzle') {
    controls['click'] = 'interact';
    controls['drag'] = 'move';
  } else {
    controls['arrows'] = 'move around';
    if (gameType === 'jumping') {
      controls['space'] = 'jump';
    }
  }
  
  return {
    gameType,
    title,
    description: `A fun ${gameType} game featuring ${character} in ${theme}`,
    character,
    objective,
    controls,
    difficulty: 'easy',
    theme,
    colors,
    elements: [character, theme, 'fun', 'colorful'],
    encouragement
  };
}

export function generateEncouragementLocal(): string {
  return getRandomFromArray(encouragements);
}