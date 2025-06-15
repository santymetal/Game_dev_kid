import { users, gameIdeas, type User, type InsertUser, type GameIdea, type InsertGameIdea } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createGameIdea(gameIdea: InsertGameIdea): Promise<GameIdea>;
  getGameIdea(id: number): Promise<GameIdea | undefined>;
  getRecentGameIdeas(limit?: number): Promise<GameIdea[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameIdeas: Map<number, GameIdea>;
  private currentUserId: number;
  private currentGameIdeaId: number;

  constructor() {
    this.users = new Map();
    this.gameIdeas = new Map();
    this.currentUserId = 1;
    this.currentGameIdeaId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGameIdea(insertGameIdea: InsertGameIdea): Promise<GameIdea> {
    const id = this.currentGameIdeaId++;
    const gameIdea: GameIdea = { ...insertGameIdea, id };
    this.gameIdeas.set(id, gameIdea);
    return gameIdea;
  }

  async getGameIdea(id: number): Promise<GameIdea | undefined> {
    return this.gameIdeas.get(id);
  }

  async getRecentGameIdeas(limit: number = 10): Promise<GameIdea[]> {
    return Array.from(this.gameIdeas.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
