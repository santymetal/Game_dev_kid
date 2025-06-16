import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Game generation with actual playable games
const gameTemplates = {
  jumping: { 
    title: "Super Jumper", 
    character: "frog", 
    theme: "forest",
    colors: { primary: "#32CD32", secondary: "#90EE90", background: "#E6FFE6" }
  },
  racing: { 
    title: "Speed Racer", 
    character: "car", 
    theme: "track",
    colors: { primary: "#FF0000", secondary: "#FF6347", background: "#FFF0F0" }
  },
  puzzle: { 
    title: "Color Match", 
    character: "wizard", 
    theme: "castle",
    colors: { primary: "#8A2BE2", secondary: "#DA70D6", background: "#F5F0FF" }
  },
  creative: { 
    title: "Art Master", 
    character: "artist", 
    theme: "studio",
    colors: { primary: "#FF69B4", secondary: "#FFB6C1", background: "#FFF0F5" }
  }
};

function detectGameType(text) {
  if (text.includes('jump') || text.includes('frog') || text.includes('hop')) return 'jumping';
  if (text.includes('race') || text.includes('car') || text.includes('speed')) return 'racing';
  if (text.includes('puzzle') || text.includes('color') || text.includes('match')) return 'puzzle';
  if (text.includes('draw') || text.includes('paint') || text.includes('art')) return 'creative';
  return 'jumping'; // default
}

function generateGameCode(gameType, colors, customData = {}) {
  switch(gameType) {
    case 'jumping':
      const playerSpeed = customData.speed === '⚡ Super Fast' ? 6 : customData.speed === '🐌 Slow and Steady' ? 2 : 3;
      const jumpPower = customData.speed === '⚡ Super Fast' ? -18 : customData.speed === '🐌 Slow and Steady' ? -12 : -15;
      const characterColor = customData.character === '🐸 Green Frog' ? '#32CD32' : 
                           customData.character === '🐰 Pink Bunny' ? '#FFB6C1' : '#4169E1';
      const bgColor = customData.theme === '🌳 Forest' ? '#E6FFE6' :
                     customData.theme === '🏠 House' ? '#FFF8DC' : '#191970';
      
      return `
        const game = {
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
          collectibleType: '${customData.collectible || '⭐ Golden Stars'}'
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
          
          ctx.fillStyle = '${colors.secondary}';
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
        
        return { game, update, render };
      `;
      
    case 'racing':
      return `
        const game = {
          car: { x: 275, y: 350, width: 50, height: 30 },
          obstacles: [
            { x: 200, y: 340, width: 40, height: 40 },
            { x: 400, y: 340, width: 40, height: 40 }
          ],
          finish: { x: 550, y: 300, width: 50, height: 100 },
          keys: {},
          finished: false
        };
        
        function update() {
          if (game.keys['ArrowLeft'] && game.car.x > 0) game.car.x -= 5;
          if (game.keys['ArrowRight'] && game.car.x < 550) game.car.x += 5;
          if (game.keys['ArrowUp'] && game.car.y > 0) game.car.y -= 3;
          if (game.keys['ArrowDown'] && game.car.y < 370) game.car.y += 3;
          
          if (game.car.x + game.car.width > game.finish.x && !game.finished) {
            game.finished = true;
          }
        }
        
        function render(ctx, canvas) {
          ctx.fillStyle = '${colors.background}';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#555';
          ctx.fillRect(0, 380, 600, 40);
          
          ctx.strokeStyle = '#FFF';
          ctx.setLineDash([20, 20]);
          ctx.beginPath();
          ctx.moveTo(0, 400);
          ctx.lineTo(600, 400);
          ctx.stroke();
          ctx.setLineDash([]);
          
          ctx.fillStyle = '#8B4513';
          game.obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          });
          
          ctx.fillStyle = '#000';
          for (let i = 0; i < 10; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#000' : '#FFF';
            ctx.fillRect(game.finish.x, game.finish.y + i * 10, game.finish.width, 10);
          }
          
          ctx.fillStyle = '${colors.primary}';
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
      
    case 'puzzle':
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
          ctx.fillStyle = '${colors.background}';
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
      
    case 'creative':
      return `
        const game = {
          drawing: [],
          currentColor: '${colors.primary}',
          brushSize: 5,
          isDrawing: false,
          colors: ['${colors.primary}', '${colors.secondary}', '#FFD700', '#FF6B6B', '#4ECDC4', '#96CEB4']
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
          if (y > 360 && y < 390) {
            const colorIndex = Math.floor((x - 10) / 40);
            if (colorIndex >= 0 && colorIndex < game.colors.length) {
              game.currentColor = game.colors[colorIndex];
            }
          }
          
          if (x > 300 && x < 370 && y > 360 && y < 390) {
            game.drawing = [];
          }
        }
        
        function render(ctx, canvas) {
          ctx.fillStyle = '#FFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
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
          
          game.colors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.fillRect(10 + i * 40, 360, 30, 30);
            if (color === game.currentColor) {
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 3;
              ctx.strokeRect(10 + i * 40, 360, 30, 30);
            }
          });
          
          ctx.fillStyle = '#EEE';
          ctx.fillRect(300, 360, 70, 30);
          ctx.fillStyle = '#000';
          ctx.font = '16px Arial';
          ctx.fillText('Clear', 315, 380);
          
          ctx.fillStyle = '#666';
          ctx.font = '14px Arial';
          ctx.fillText('Click and drag to draw! Pick colors below.', 10, 20);
        }
        
        return { game, render, handleClick, handleMouseDown, handleMouseMove, handleMouseUp };
      `;
      
    default:
      return generateGameCode('jumping', colors);
  }
}

// Step-by-step game construction
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

app.post('/api/voice/process', (req, res) => {
  const { transcript } = req.body;
  const gameType = detectGameType(transcript.toLowerCase());
  const template = gameTemplates[gameType];
  
  res.json({
    success: true,
    gameId: Date.now(),
    interpretation: {
      gameType,
      title: template.title,
      character: template.character,
      theme: template.theme,
      encouragement: "Great idea! Let's build your game together!"
    },
    construction: {
      steps: constructionSteps[gameType],
      currentStep: 1,
      totalSteps: constructionSteps[gameType].length
    }
  });
});

// Handle construction step responses
app.post('/api/construction/step', (req, res) => {
  const { gameType, step, choice, gameData } = req.body;
  
  const steps = constructionSteps[gameType];
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
    const template = gameTemplates[gameType];
    const gameCode = generateGameCode(gameType, template.colors, updatedGameData);
    
    res.json({
      success: true,
      completed: true,
      gameData: updatedGameData,
      game: {
        gameCode: gameCode,
        instructions: `You built an amazing ${gameType} game! Use arrow keys to play!`
      },
      celebration: "🎉 Amazing! You built your very own game! 🎉"
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(`Voice Builder running on http://localhost:${port}`);
});