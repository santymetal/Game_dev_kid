import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertGameIdeaSchema } from "@shared/schema.js";
import { interpretChildIdeaLocal, generateEncouragementLocal } from "./services/localGameGenerator.js";
import { generateGameCode } from "./services/gameGenerator.js";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Process voice input and generate game
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
      
      // Generate the actual game code
      const generatedGame = generateGameCode(interpretation);
      
      // Store the game idea
      const gameIdea = await storage.createGameIdea({
        transcript,
        gameType: interpretation.gameType,
        gameConfig: interpretation,
        createdAt: new Date().toISOString()
      });

      res.json({
        success: true,
        gameId: gameIdea.id,
        interpretation,
        game: generatedGame,
        encouragement: interpretation.encouragement
      });
      
    } catch (error) {
      console.error("Voice processing error:", error);
      res.status(500).json({ 
        message: "I had trouble understanding that. Can you try saying it again?" 
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
