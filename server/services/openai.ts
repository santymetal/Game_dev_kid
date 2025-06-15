import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

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

export async function interpretChildIdea(transcript: string): Promise<GameInterpretation> {
  try {
    const prompt = `You are a friendly AI assistant helping a 5-year-old child create their dream game. 

The child said: "${transcript}"

Based on their idea, create a simple, fun game concept that a 5-year-old can understand and enjoy. The game should be:
- Very simple with basic mechanics
- Colorful and engaging
- Easy to control (arrow keys, mouse clicks, or space bar)
- Encouraging and positive
- Safe and appropriate for children

Respond with a JSON object containing:
{
  "gameType": "jumping|puzzle|racing|creative|adventure|collection",
  "title": "Short, fun game title",
  "description": "Simple description a 5-year-old would understand",
  "character": "Main character (animal, person, etc.)",
  "objective": "What the player needs to do",
  "controls": {"key": "what it does"},
  "difficulty": "easy|medium|hard",
  "theme": "Setting/environment (ocean, forest, space, etc.)",
  "colors": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor", 
    "background": "#hexcolor"
  },
  "elements": ["list", "of", "game", "elements"],
  "encouragement": "Positive message for the child"
}

Make sure the game is inspired by their idea but simplified for their age. Use bright, cheerful colors and include elements they mentioned.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates simple game concepts for young children based on their spoken ideas. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate and provide defaults
    return {
      gameType: result.gameType || 'adventure',
      title: result.title || 'Your Amazing Game',
      description: result.description || 'A fun game made from your idea!',
      character: result.character || 'Happy Character',
      objective: result.objective || 'Have fun and explore!',
      controls: result.controls || { "arrows": "move around", "space": "jump" },
      difficulty: result.difficulty || 'easy',
      theme: result.theme || 'magical world',
      colors: {
        primary: result.colors?.primary || '#FF6B6B',
        secondary: result.colors?.secondary || '#4ECDC4',
        background: result.colors?.background || '#45B7D1'
      },
      elements: result.elements || ['character', 'goal', 'fun'],
      encouragement: result.encouragement || 'Great job thinking of this awesome idea!'
    };

  } catch (error) {
    console.error('OpenAI interpretation error:', error);
    
    // Fallback response for errors
    return {
      gameType: 'adventure',
      title: 'Your Creative Game',
      description: 'A special game made from your wonderful idea!',
      character: 'Friendly Hero',
      objective: 'Explore and have fun!',
      controls: { "arrows": "move", "space": "jump" },
      difficulty: 'easy',
      theme: 'colorful world',
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        background: '#45B7D1'
      },
      elements: ['adventure', 'fun', 'creativity'],
      encouragement: 'Your imagination is amazing! Let\'s play your game!'
    };
  }
}

export async function generateEncouragement(childName?: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a short, encouraging message for a 5-year-old child who just created a game idea. Keep it simple, positive, and enthusiastic. Use emojis."
        },
        {
          role: "user",
          content: `Generate an encouraging message${childName ? ` for ${childName}` : ''}`
        }
      ],
    });

    return response.choices[0].message.content || "You're doing great! Keep being creative! 🌟";
  } catch (error) {
    return "Wow! You have such amazing ideas! Keep up the great work! 🎮✨";
  }
}
