import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Simple game generation without AI
const gameTemplates = {
  jumping: { title: "Super Jumper", character: "frog", theme: "forest" },
  racing: { title: "Speed Racer", character: "car", theme: "track" },
  puzzle: { title: "Color Match", character: "wizard", theme: "castle" },
  creative: { title: "Art Master", character: "artist", theme: "studio" }
};

function detectGameType(text) {
  if (text.includes('jump') || text.includes('frog')) return 'jumping';
  if (text.includes('race') || text.includes('car')) return 'racing';
  if (text.includes('puzzle') || text.includes('color')) return 'puzzle';
  if (text.includes('draw') || text.includes('paint')) return 'creative';
  return 'jumping'; // default
}

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
      encouragement: "Great idea! Let's play!"
    },
    game: {
      gameCode: `console.log('${template.title} game created!');`,
      instructions: `Play as ${template.character} in ${template.theme}!`
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(`Voice Builder running on http://localhost:${port}`);
});