import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertGameIdeaSchema } from "@shared/schema.js";
import { interpretChildIdeaLocal, generateEncouragementLocal } from "./services/localGameGenerator.js";
import { generateGameCode } from "./services/gameGenerator.js";

// Step-by-step construction data
const constructionSteps: Record<string, any[]> = {
  jumping: [
    { step: 1, question: "What should your character look like?", options: ["🐸 Green Frog", "🐰 Pink Bunny", "🦘 Blue Kangaroo"], property: "character" },
    { step: 2, question: "Where should your character play?", options: ["🌳 Forest", "🏠 House", "🌙 Space"], property: "theme" },
    { step: 3, question: "How fast should your character move?", options: ["🐌 Slow and Steady", "⚡ Super Fast", "🚶 Just Right"], property: "speed" },
    { step: 4, question: "What should your character collect?", options: ["⭐ Golden Stars", "🍎 Tasty Apples", "💎 Shiny Gems"], property: "collectible" }
  ],
  racing: [
    { step: 1, question: "What should you drive?", options: ["🚗 Red Car", "🚌 School Bus", "🚁 Helicopter"], property: "vehicle" },
    { step: 2, question: "Where should you race?", options: ["🏁 Race Track", "🌆 City Streets", "🏔️ Mountain Road"], property: "track" },
    { step: 3, question: "What obstacles should you avoid?", options: ["🚧 Orange Cones", "🪨 Big Rocks", "🌊 Water Puddles"], property: "obstacles" },
    { step: 4, question: "How should you win?", options: ["🏁 Reach the Finish", "⏰ Beat the Timer", "🏆 Collect Most Points"], property: "winCondition" }
  ],
  puzzle: [
    { step: 1, question: "What colors should you match?", options: ["🌈 Rainbow Colors", "🍬 Candy Colors", "🌸 Flower Colors"], property: "colorTheme" },
    { step: 2, question: "How many cards should you match?", options: ["🔢 Easy (8 cards)", "🔢 Medium (12 cards)", "🔢 Hard (16 cards)"], property: "difficulty" },
    { step: 3, question: "What shape should the cards be?", options: ["⬜ Square Cards", "🔴 Round Cards", "⭐ Star Cards"], property: "cardShape" },
    { step: 4, question: "What happens when you match?", options: ["✨ Sparkle Effect", "🎵 Happy Sound", "🎉 Celebration"], property: "matchEffect" }
  ],
  creative: [
    { step: 1, question: "What should you draw with?", options: ["🖌️ Paint Brush", "✏️ Pencil", "🖍️ Crayon"], property: "tool" },
    { step: 2, question: "What colors do you want?", options: ["🌈 All Colors", "🎨 Bright Colors", "🌸 Soft Colors"], property: "palette" },
    { step: 3, question: "How big should your brush be?", options: ["🔹 Small Brush", "🔸 Medium Brush", "🔶 Big Brush"], property: "brushSize" },
    { step: 4, question: "What should you draw on?", options: ["📄 White Paper", "🌌 Starry Sky", "🌊 Ocean Scene"], property: "canvas" }
  ],
  adventure: [
    { step: 1, question: "What should your character look like?", options: ["🐸 Green Frog", "🐰 Pink Bunny", "🦘 Blue Kangaroo"], property: "character" },
    { step: 2, question: "Where should your character play?", options: ["🌳 Forest", "🏠 House", "🌙 Space"], property: "theme" },
    { step: 3, question: "How fast should your character move?", options: ["🐌 Slow and Steady", "⚡ Super Fast", "🚶 Just Right"], property: "speed" },
    { step: 4, question: "What should your character collect?", options: ["⭐ Golden Stars", "🍎 Tasty Apples", "💎 Shiny Gems"], property: "collectible" }
  ],
  collection: [
    { step: 1, question: "What should your character look like?", options: ["🐸 Green Frog", "🐰 Pink Bunny", "🦘 Blue Kangaroo"], property: "character" },
    { step: 2, question: "Where should your character play?", options: ["🌳 Forest", "🏠 House", "🌙 Space"], property: "theme" },
    { step: 3, question: "How fast should your character move?", options: ["🐌 Slow and Steady", "⚡ Super Fast", "🚶 Just Right"], property: "speed" },
    { step: 4, question: "What should your character collect?", options: ["⭐ Golden Stars", "🍎 Tasty Apples", "💎 Shiny Gems"], property: "collectible" }
  ]
};

// Generate custom game code based on construction choices
function generateCustomGameCode(gameType: string, interpretation: any, customData: any) {
  const playerSpeed = customData.speed === '⚡ Super Fast' ? 6 : customData.speed === '🐌 Slow and Steady' ? 2 : 3;
  const jumpPower = customData.speed === '⚡ Super Fast' ? -18 : customData.speed === '🐌 Slow and Steady' ? -12 : -15;
  const characterColor = customData.character === '🐸 Green Frog' ? '#32CD32' : 
                       customData.character === '🐰 Pink Bunny' ? '#FFB6C1' : '#4169E1';
  const bgColor = customData.theme === '🌳 Forest' ? '#E6FFE6' :
                 customData.theme === '🏠 House' ? '#FFF8DC' : '#191970';
  const collectibleType = customData.collectible || '⭐ Golden Stars';

  if (gameType === 'jumping') {
    return {
      id: `custom_game_${Date.now()}`,
      config: interpretation,
      gameCode: `const game = {
          player: { x: 50, y: 300, width: 40, height: 40, velocityY: 0, onGround: true },
          platforms: [
            { x: 0, y: 350, width: 200, height: 20 },
            { x: 250, y: 300, width: 150, height: 20 },
            { x: 450, y: 250, width: 150, height: 20 }
          ],
          collectibles: [
            { x: 300, y: 270, collected: false },
            { x: 500, y: 220, collected: false }
          ],
          score: 0,
          keys: {},
          gravity: 0.8,
          playerSpeed: ${playerSpeed},
          jumpPower: ${jumpPower},
          characterColor: '${characterColor}',
          bgColor: '${bgColor}',
          collectibleType: '${collectibleType}'
        };

        function update() {
          if (!game.player.onGround) {
            game.player.velocityY += game.gravity;
          }
          
          if (game.keys['ArrowLeft']) game.player.x -= game.playerSpeed;
          if (game.keys['ArrowRight']) game.player.x += game.playerSpeed;
          if (game.keys[' '] && game.player.onGround) {
            game.player.velocityY = game.jumpPower;
            game.player.onGround = false;
          }
          
          game.player.y += game.player.velocityY;
          
          game.player.onGround = false;
          game.platforms.forEach(platform => {
            if (game.player.x < platform.x + platform.width &&
                game.player.x + game.player.width > platform.x &&
                game.player.y + game.player.height > platform.y &&
                game.player.y + game.player.height < platform.y + platform.height + 10) {
              game.player.y = platform.y - game.player.height;
              game.player.velocityY = 0;
              game.player.onGround = true;
            }
          });
          
          game.collectibles.forEach(item => {
            if (!item.collected && 
                Math.abs(game.player.x - item.x) < 30 && 
                Math.abs(game.player.y - item.y) < 30) {
              item.collected = true;
              game.score += 10;
            }
          });
        }
        
        function render(ctx, canvas) {
          ctx.fillStyle = game.bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#8B4513';
          game.platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
          });
          
          ctx.fillStyle = game.characterColor;
          ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
          
          const collectibleColor = game.collectibleType.includes('Stars') ? '#FFD700' : 
                                  game.collectibleType.includes('Apples') ? '#FF0000' : '#FF69B4';
          ctx.fillStyle = collectibleColor;
          game.collectibles.forEach(item => {
            if (!item.collected) {
              ctx.beginPath();
              ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          
          ctx.fillStyle = '#000';
          ctx.font = '20px Arial';
          ctx.fillText('Score: ' + game.score, 10, 30);
          ctx.fillText('Collect: ' + game.collectibleType.split(' ')[1], 10, 60);
        }
        
        return { game, update, render };`,
      instructions: `You built an amazing ${gameType} game! Use arrow keys to control your ${customData.character}!`
    };
  }
  
  // Fallback to default generator for other game types
  return generateGameCode(interpretation);
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Process voice input and start construction process
  app.post("/api/voice/process", async (req, res) => {
    try {
      const { transcript } = req.body;
      
      if (!transcript || typeof transcript !== 'string') {
        return res.status(400).json({ 
          message: "Please provide a transcript of what you said!" 
        });
      }

      // Use local interpreter to understand the child's idea
      const interpretation = interpretChildIdeaLocal(transcript);
      const gameType = interpretation.gameType;

      res.json({
        success: true,
        gameId: Date.now(),
        interpretation: {
          gameType,
          title: interpretation.title,
          character: interpretation.character,
          theme: interpretation.theme,
          encouragement: "Great idea! Let's build your game together!"
        },
        construction: {
          steps: constructionSteps[gameType] || constructionSteps['jumping'],
          currentStep: 1,
          totalSteps: (constructionSteps[gameType] || constructionSteps['jumping']).length
        }
      });
      
    } catch (error) {
      console.error("Voice processing error:", error);
      res.status(500).json({ 
        message: "I had trouble understanding that. Can you try saying it again?" 
      });
    }
  });

  // Handle construction step responses
  app.post("/api/construction/step", async (req, res) => {
    try {
      const { gameType, step, choice, gameData } = req.body;
      
      const steps = constructionSteps[gameType] || constructionSteps['jumping'];
      const currentStepData = steps[step - 1];
      
      // Update game data with choice
      const updatedGameData = { ...gameData };
      updatedGameData[currentStepData.property] = choice;
      
      if (step < steps.length) {
        // More steps to go
        res.json({
          success: true,
          nextStep: step + 1,
          stepData: steps[step],
          gameData: updatedGameData,
          progress: `Step ${step + 1} of ${steps.length}`
        });
      } else {
        // Final step - generate the game with custom choices
        const interpretation = interpretChildIdeaLocal("jumping game"); // Base interpretation
        interpretation.gameType = gameType; // Ensure correct game type
        
        // Apply custom choices to the interpretation
        if (updatedGameData.character) {
          interpretation.character = updatedGameData.character.toLowerCase().includes('frog') ? 'frog' : 
                                   updatedGameData.character.toLowerCase().includes('bunny') ? 'bunny' : 'kangaroo';
        }
        if (updatedGameData.theme) {
          interpretation.theme = updatedGameData.theme.toLowerCase().includes('forest') ? 'forest' : 
                               updatedGameData.theme.toLowerCase().includes('house') ? 'house' : 'space';
        }
        
        // Generate custom game code
        const generatedGame = generateCustomGameCode(gameType, interpretation, updatedGameData);
        
        // Store the completed game
        await storage.createGameIdea({
          transcript: `Custom ${gameType} game`,
          gameType: gameType,
          gameConfig: { ...interpretation, customData: updatedGameData },
          createdAt: new Date().toISOString()
        });
        
        res.json({
          success: true,
          completed: true,
          gameData: updatedGameData,
          game: generatedGame,
          celebration: "Amazing! You built your very own game!"
        });
      }
    } catch (error) {
      console.error("Construction step error:", error);
      res.status(500).json({ 
        message: "Something went wrong with building your game. Try again!" 
      });
    }
  });

  // Get encouragement message
  app.get("/api/encouragement", async (req, res) => {
    try {
      const message = generateEncouragementLocal();
      res.json({ message });
    } catch (error) {
      res.json({ message: "You're doing amazing! Keep being creative! 🌟" });
    }
  });

  // Get recent game ideas
  app.get("/api/games/recent", async (req, res) => {
    try {
      const games = await storage.getRecentGameIdeas(5);
      res.json(games);
    } catch (error) {
      console.error("Error fetching recent games:", error);
      res.status(500).json({ message: "Could not load recent games" });
    }
  });

  // Get specific game
  app.get("/api/games/:id", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const game = await storage.getGameIdea(gameId);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      console.error("Error fetching game:", error);
      res.status(500).json({ message: "Could not load game" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
