// Simple game engine utilities for child-friendly games

export interface GameState {
  score: number;
  lives: number;
  level: number;
  gameOver: boolean;
  won: boolean;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  visible?: boolean;
}

export class SimpleGameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameObjects: GameObject[] = [];
  gameState: GameState;
  keys: Record<string, boolean> = {};
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.gameState = {
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      won: false
    };
    
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      e.preventDefault();
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      e.preventDefault();
    });
  }
  
  addGameObject(obj: GameObject) {
    this.gameObjects.push(obj);
  }
  
  removeGameObject(obj: GameObject) {
    const index = this.gameObjects.indexOf(obj);
    if (index > -1) {
      this.gameObjects.splice(index, 1);
    }
  }
  
  checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }
  
  isKeyPressed(key: string): boolean {
    return !!this.keys[key];
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  drawRect(obj: GameObject) {
    if (obj.visible === false) return;
    
    this.ctx.fillStyle = obj.color || '#000';
    this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }
  
  drawCircle(x: number, y: number, radius: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawText(text: string, x: number, y: number, size: number = 20, color: string = '#000') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px Arial`;
    this.ctx.fillText(text, x, y);
  }
  
  renderGameObjects() {
    this.gameObjects.forEach(obj => this.drawRect(obj));
  }
  
  renderUI() {
    this.drawText(`Score: ${this.gameState.score}`, 10, 30);
    this.drawText(`Lives: ${this.gameState.lives}`, 10, 60);
    
    if (this.gameState.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.drawText(
        this.gameState.won ? 'You Win! 🎉' : 'Game Over! 😢',
        this.canvas.width / 2 - 100,
        this.canvas.height / 2,
        48,
        '#FFF'
      );
    }
  }
  
  update() {
    // Override in specific games
  }
  
  render() {
    this.clear();
    this.renderGameObjects();
    this.renderUI();
  }
  
  gameLoop = () => {
    if (!this.gameState.gameOver) {
      this.update();
    }
    this.render();
    requestAnimationFrame(this.gameLoop);
  }
  
  start() {
    this.gameLoop();
  }
  
  reset() {
    this.gameState = {
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      won: false
    };
    this.gameObjects = [];
    this.keys = {};
  }
}

// Utility functions for child-friendly game development
export const GameUtils = {
  // Generate random bright colors that kids love
  getRandomBrightColor(): string {
    const colors = [
      '#FF6B6B', // coral
      '#4ECDC4', // turquoise  
      '#45B7D1', // sky blue
      '#96CEB4', // mint
      '#FFEAA7', // sunny yellow
      '#DDA0DD', // lavender
      '#FFB6C1', // light pink
      '#98FB98', // pale green
      '#F0E68C', // khaki
      '#FFA07A'  // light salmon
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },
  
  // Random position within canvas bounds
  getRandomPosition(canvasWidth: number, canvasHeight: number, objectWidth: number = 0, objectHeight: number = 0) {
    return {
      x: Math.random() * (canvasWidth - objectWidth),
      y: Math.random() * (canvasHeight - objectHeight)
    };
  },
  
  // Distance between two points
  getDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },
  
  // Clamp value between min and max
  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
};
