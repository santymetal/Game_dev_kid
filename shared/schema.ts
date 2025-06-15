import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameIdeas = pgTable("game_ideas", {
  id: serial("id").primaryKey(),
  transcript: text("transcript").notNull(),
  gameType: text("game_type").notNull(),
  gameConfig: jsonb("game_config").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameIdeaSchema = createInsertSchema(gameIdeas).pick({
  transcript: true,
  gameType: true,
  gameConfig: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGameIdea = z.infer<typeof insertGameIdeaSchema>;
export type GameIdea = typeof gameIdeas.$inferSelect;

// Game configuration types
export const gameConfigSchema = z.object({
  title: z.string(),
  description: z.string(),
  character: z.string(),
  objective: z.string(),
  controls: z.record(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  theme: z.string(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
  }),
});

export type GameConfig = z.infer<typeof gameConfigSchema>;
