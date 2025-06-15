import { GameInterpretation } from './openai.js';

export interface GeneratedGame {
  id: string;
  config: GameInterpretation;
  gameCode: string;
  instructions: string;
}

export function generateGameCode(interpretation: GameInterpretation): GeneratedGame {
  const gameId = `game_${Date.now()}`;
  
  let gameCode = '';
  let instructions = '';

  switch (interpretation.gameType) {
    case 'jumping':
      gameCode = generateJumpingGame(interpretation);
      instructions = `Use the arrow keys to move ${interpretation.character} and press SPACE to jump! ${interpretation.objective}`;
      break;
    
    case 'collection':
      gameCode = generateCollectionGame(interpretation);
      instructions = `Move ${interpretation.character} with arrow keys to collect items! ${interpretation.objective}`;
      break;
    
    case 'racing':
      gameCode = generateRacingGame(interpretation);
      instructions = `Use arrow keys to drive ${interpretation.character} and race to the finish! ${interpretation.objective}`;
      break;
    
    case 'puzzle':
      gameCode = generatePuzzleGame(interpretation);
      instructions = `Click on items to match them up! ${interpretation.objective}`;
      break;
    
    case 'creative':
      gameCode = generateCreativeGame(interpretation);
      instructions = `Click and drag to create art! Use different colors to make something beautiful!`;
      break;
    
    default:
      gameCode = generateAdventureGame(interpretation);
      instructions = `Use arrow keys to move ${interpretation.character} around and explore! ${interpretation.objective}`;
  }

  return {
    id: gameId,
    config: interpretation,
    gameCode,
    instructions
  };
}

function generateJumpingGame(config: GameInterpretation): string {
  return `
    const game = {
      character: { x: 50, y: 300, width: 40, height: 40, velocityY: 0, onGround: true },
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
      gravity: 0.8
    };

    const colors = ${JSON.stringify(config.colors)};
    
    function update() {
      // Gravity
      if (!game.character.onGround) {
        game.character.velocityY += game.gravity;
      }
      
      // Movement
      if (game.keys['ArrowLeft']) game.character.x -= 3;
      if (game.keys['ArrowRight']) game.character.x += 3;
      if (game.keys[' '] && game.character.onGround) {
        game.character.velocityY = -15;
        game.character.onGround = false;
      }
      
      game.character.y += game.character.velocityY;
      
      // Platform collision
      game.character.onGround = false;
      game.platforms.forEach(platform => {
        if (game.character.x < platform.x + platform.width &&
            game.character.x + game.character.width > platform.x &&
            game.character.y + game.character.height > platform.y &&
            game.character.y + game.character.height < platform.y + platform.height + 10) {
          game.character.y = platform.y - game.character.height;
          game.character.velocityY = 0;
          game.character.onGround = true;
        }
      });
      
      // Collectibles
      game.collectibles.forEach(item => {
        if (!item.collected && 
            Math.abs(game.character.x - item.x) < 30 && 
            Math.abs(game.character.y - item.y) < 30) {
          item.collected = true;
          game.score += 10;
        }
      });
    }
    
    function render(ctx, canvas) {
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Platforms
      ctx.fillStyle = colors.secondary;
      game.platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });
      
      // Character
      ctx.fillStyle = colors.primary;
      ctx.fillRect(game.character.x, game.character.y, game.character.width, game.character.height);
      
      // Collectibles
      ctx.fillStyle = '#FFD700';
      game.collectibles.forEach(item => {
        if (!item.collected) {
          ctx.beginPath();
          ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Score
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('Score: ' + game.score, 10, 30);
    }
    
    return { game, update, render };
  `;
}

function generateCollectionGame(config: GameInterpretation): string {
  return `
    const game = {
      character: { x: 200, y: 200, width: 30, height: 30 },
      items: Array.from({length: 8}, (_, i) => ({
        x: Math.random() * 550 + 25,
        y: Math.random() * 350 + 25,
        collected: false,
        type: i % 3
      })),
      score: 0,
      keys: {}
    };

    const colors = ${JSON.stringify(config.colors)};
    const itemColors = ['#FFD700', '#FF6B6B', '#4ECDC4'];
    
    function update() {
      if (game.keys['ArrowLeft']) game.character.x = Math.max(0, game.character.x - 4);
      if (game.keys['ArrowRight']) game.character.x = Math.min(570, game.character.x + 4);
      if (game.keys['ArrowUp']) game.character.y = Math.max(0, game.character.y - 4);
      if (game.keys['ArrowDown']) game.character.y = Math.min(370, game.character.y + 4);
      
      // Collect items
      game.items.forEach(item => {
        if (!item.collected && 
            Math.abs(game.character.x - item.x) < 25 && 
            Math.abs(game.character.y - item.y) < 25) {
          item.collected = true;
          game.score += 5;
        }
      });
    }
    
    function render(ctx, canvas) {
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Items
      game.items.forEach(item => {
        if (!item.collected) {
          ctx.fillStyle = itemColors[item.type];
          ctx.beginPath();
          ctx.arc(item.x, item.y, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Character
      ctx.fillStyle = colors.primary;
      ctx.fillRect(game.character.x, game.character.y, game.character.width, game.character.height);
      
      // Score
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('Score: ' + game.score, 10, 30);
      
      // Win condition
      if (game.items.every(item => item.collected)) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('You Win! 🎉', canvas.width/2, canvas.height/2);
        ctx.textAlign = 'start';
      }
    }
    
    return { game, update, render };
  `;
}

function generateRacingGame(config: GameInterpretation): string {
  return `
    const game = {
      car: { x: 275, y: 350, width: 50, height: 30, speed: 0 },
      track: { y: 380, width: 600, height: 40 },
      obstacles: [
        { x: 200, y: 340 },
        { x: 400, y: 340 },
        { x: 100, y: 340 }
      ],
      finish: { x: 550, y: 300, width: 50, height: 100 },
      keys: {},
      finished: false
    };

    const colors = ${JSON.stringify(config.colors)};
    
    function update() {
      if (game.keys['ArrowLeft'] && game.car.x > 0) game.car.x -= 5;
      if (game.keys['ArrowRight'] && game.car.x < 550) game.car.x += 5;
      if (game.keys['ArrowUp'] && game.car.y > 0) game.car.y -= 3;
      if (game.keys['ArrowDown'] && game.car.y < 370) game.car.y += 3;
      
      // Check finish line
      if (game.car.x + game.car.width > game.finish.x && !game.finished) {
        game.finished = true;
      }
    }
    
    function render(ctx, canvas) {
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Track
      ctx.fillStyle = '#555';
      ctx.fillRect(0, game.track.y, game.track.width, game.track.height);
      
      // Track lines
      ctx.strokeStyle = '#FFF';
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(0, game.track.y + 20);
      ctx.lineTo(600, game.track.y + 20);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Obstacles
      ctx.fillStyle = '#8B4513';
      game.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, 40, 40);
      });
      
      // Finish line
      ctx.fillStyle = '#000';
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#000' : '#FFF';
        ctx.fillRect(game.finish.x, game.finish.y + i * 10, game.finish.width, 10);
      }
      
      // Car
      ctx.fillStyle = colors.primary;
      ctx.fillRect(game.car.x, game.car.y, game.car.width, game.car.height);
      
      if (game.finished) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('You Win! 🏁', canvas.width/2, canvas.height/2);
        ctx.textAlign = 'start';
      }
    }
    
    return { game, update, render };
  `;
}

function generatePuzzleGame(config: GameInterpretation): string {
  return `
    const game = {
      grid: Array.from({length: 16}, (_, i) => ({
        id: i,
        color: Math.floor(i / 4),
        matched: false,
        flipped: false
      })).sort(() => Math.random() - 0.5),
      selected: [],
      matches: 0,
      clicks: 0
    };

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    const bgColor = ${JSON.stringify(config.colors.background)};
    
    function handleClick(x, y) {
      const col = Math.floor(x / 100);
      const row = Math.floor(y / 100);
      const index = row * 4 + col;
      
      if (index < 0 || index >= 16) return;
      
      const card = game.grid[index];
      if (card.matched || card.flipped) return;
      
      card.flipped = true;
      game.selected.push(index);
      game.clicks++;
      
      if (game.selected.length === 2) {
        const [first, second] = game.selected;
        if (game.grid[first].color === game.grid[second].color) {
          game.grid[first].matched = true;
          game.grid[second].matched = true;
          game.matches++;
        } else {
          setTimeout(() => {
            game.grid[first].flipped = false;
            game.grid[second].flipped = false;
          }, 1000);
        }
        game.selected = [];
      }
    }
    
    function render(ctx, canvas) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < 16; i++) {
        const x = (i % 4) * 100 + 100;
        const y = Math.floor(i / 4) * 100 + 50;
        const card = game.grid[i];
        
        if (card.flipped || card.matched) {
          ctx.fillStyle = colors[card.color];
        } else {
          ctx.fillStyle = '#DDD';
        }
        
        ctx.fillRect(x, y, 80, 80);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x, y, 80, 80);
      }
      
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('Matches: ' + game.matches + '/8', 10, 30);
      ctx.fillText('Clicks: ' + game.clicks, 10, 60);
      
      if (game.matches === 8) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Perfect! 🧩', canvas.width/2, canvas.height/2);
        ctx.textAlign = 'start';
      }
    }
    
    return { game, render, handleClick };
  `;
}

function generateCreativeGame(config: GameInterpretation): string {
  return `
    const game = {
      drawing: [],
      currentColor: '${config.colors.primary}',
      brushSize: 5,
      isDrawing: false,
      colors: ['${config.colors.primary}', '${config.colors.secondary}', '#FFD700', '#FF6B6B', '#4ECDC4', '#96CEB4'],
      currentTool: 'brush'
    };
    
    function handleMouseDown(x, y) {
      game.isDrawing = true;
      game.drawing.push({
        x, y, 
        color: game.currentColor, 
        size: game.brushSize, 
        type: 'start'
      });
    }
    
    function handleMouseMove(x, y) {
      if (game.isDrawing) {
        game.drawing.push({
          x, y, 
          color: game.currentColor, 
          size: game.brushSize, 
          type: 'draw'
        });
      }
    }
    
    function handleMouseUp() {
      game.isDrawing = false;
    }
    
    function handleClick(x, y) {
      // Color palette clicks
      if (y > 360 && y < 390) {
        const colorIndex = Math.floor((x - 10) / 40);
        if (colorIndex >= 0 && colorIndex < game.colors.length) {
          game.currentColor = game.colors[colorIndex];
        }
      }
      
      // Clear button
      if (x > 300 && x < 370 && y > 360 && y < 390) {
        game.drawing = [];
      }
    }
    
    function render(ctx, canvas) {
      ctx.fillStyle = '#FFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw strokes
      ctx.lineCap = 'round';
      let currentPath = null;
      
      game.drawing.forEach(point => {
        if (point.type === 'start') {
          ctx.beginPath();
          ctx.strokeStyle = point.color;
          ctx.lineWidth = point.size;
          ctx.moveTo(point.x, point.y);
          currentPath = { color: point.color, size: point.size };
        } else if (point.type === 'draw' && currentPath) {
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      });
      
      // Color palette
      game.colors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(10 + i * 40, 360, 30, 30);
        if (color === game.currentColor) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 3;
          ctx.strokeRect(10 + i * 40, 360, 30, 30);
        }
      });
      
      // Clear button
      ctx.fillStyle = '#EEE';
      ctx.fillRect(300, 360, 70, 30);
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText('Clear', 315, 380);
      
      // Instructions
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial';
      ctx.fillText('Click and drag to draw! Pick colors below.', 10, 20);
    }
    
    return { game, render, handleClick, handleMouseDown, handleMouseMove, handleMouseUp };
  `;
}

function generateAdventureGame(config: GameInterpretation): string {
  return `
    const game = {
      player: { x: 50, y: 200, width: 30, height: 30 },
      goal: { x: 520, y: 180, width: 40, height: 40 },
      obstacles: [
        { x: 150, y: 150, width: 30, height: 80 },
        { x: 250, y: 100, width: 100, height: 30 },
        { x: 400, y: 200, width: 30, height: 100 }
      ],
      treasures: [
        { x: 200, y: 50, collected: false },
        { x: 350, y: 150, collected: false },
        { x: 450, y: 50, collected: false }
      ],
      keys: {},
      score: 0,
      won: false
    };

    const colors = ${JSON.stringify(config.colors)};
    
    function update() {
      const speed = 3;
      let newX = game.player.x;
      let newY = game.player.y;
      
      if (game.keys['ArrowLeft']) newX -= speed;
      if (game.keys['ArrowRight']) newX += speed;
      if (game.keys['ArrowUp']) newY -= speed;
      if (game.keys['ArrowDown']) newY += speed;
      
      // Boundary check
      newX = Math.max(0, Math.min(570, newX));
      newY = Math.max(0, Math.min(370, newY));
      
      // Obstacle collision
      let canMove = true;
      game.obstacles.forEach(obstacle => {
        if (newX < obstacle.x + obstacle.width &&
            newX + game.player.width > obstacle.x &&
            newY < obstacle.y + obstacle.height &&
            newY + game.player.height > obstacle.y) {
          canMove = false;
        }
      });
      
      if (canMove) {
        game.player.x = newX;
        game.player.y = newY;
      }
      
      // Treasure collection
      game.treasures.forEach(treasure => {
        if (!treasure.collected &&
            Math.abs(game.player.x - treasure.x) < 25 &&
            Math.abs(game.player.y - treasure.y) < 25) {
          treasure.collected = true;
          game.score += 100;
        }
      });
      
      // Win condition
      if (Math.abs(game.player.x - game.goal.x) < 30 &&
          Math.abs(game.player.y - game.goal.y) < 30) {
        game.won = true;
      }
    }
    
    function render(ctx, canvas) {
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Obstacles
      ctx.fillStyle = '#8B4513';
      game.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });
      
      // Treasures
      ctx.fillStyle = '#FFD700';
      game.treasures.forEach(treasure => {
        if (!treasure.collected) {
          ctx.beginPath();
          ctx.arc(treasure.x + 10, treasure.y + 10, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Goal
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(game.goal.x, game.goal.y, game.goal.width, game.goal.height);
      
      // Player
      ctx.fillStyle = colors.primary;
      ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
      
      // Score
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('Score: ' + game.score, 10, 30);
      
      if (game.won) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Adventure Complete! 🎯', canvas.width/2, canvas.height/2);
        ctx.textAlign = 'start';
      }
    }
    
    return { game, update, render };
  `;
}
