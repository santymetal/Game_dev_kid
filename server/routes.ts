import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertGameIdeaSchema } from "@shared/schema.js";
import { interpretChildIdeaLocal, generateEncouragementLocal } from "./services/localGameGenerator.js";
import { generateGameCode } from "./services/gameGenerator.js";

// Step-by-step construction data
const constructionSteps = {
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
  ]
};

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
          steps: constructionSteps[gameType] || constructionSteps.jumping,
          currentStep: 1,
          totalSteps: (constructionSteps[gameType] || constructionSteps.jumping).length
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
      
      const steps = constructionSteps[gameType] || constructionSteps.jumping;
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
        // Final step - generate the game
        const interpretation = interpretChildIdeaLocal("jumping game"); // Base interpretation
        interpretation.customData = updatedGameData; // Add custom choices
        const generatedGame = generateGameCode(interpretation);
        
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
