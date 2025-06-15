# Voice Builder - Kids Game Creation Platform

A voice-enabled creative platform that allows children (aged 5+) to create simple games using voice commands. The application uses local keyword detection to interpret spoken game ideas and generates playable games with encouraging feedback.

## Features

- **Voice Recognition**: Uses browser's Web Speech API to listen to children's ideas
- **Local Game Generation**: No API keys required - everything runs offline
- **6 Game Types**: Jumping, racing, puzzles, drawing, collection, and adventure games
- **Child-Friendly Interface**: Bright colors, simple controls, encouraging messages
- **Instant Playability**: Games are generated and playable immediately

## Quick Start

### Prerequisites

- Node.js 18+ 
- Modern web browser with microphone access

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd voice-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## How to Use

1. **Click the microphone button** to start listening
2. **Say your game idea** like:
   - "I want a jumping frog game"
   - "Make a car racing game" 
   - "Create a color puzzle"
   - "Draw and paint game"
3. **Click the microphone again** to stop recording
4. **Play your generated game** immediately!

## Supported Voice Commands

The system understands simple keywords:

- **Animals**: frog, bunny, cat, dog, bird, lion, etc.
- **Actions**: jump, race, collect, paint, draw, explore
- **Places**: forest, space, ocean, castle, city
- **Things**: car, treasure, colors, puzzle

## Game Types

- **Jumping Games**: Platform-style games with gravity and obstacles
- **Racing Games**: Drive vehicles to reach the finish line
- **Collection Games**: Gather items and treasures around the map
- **Puzzle Games**: Match colors and solve memory challenges
- **Creative Tools**: Drawing and painting with multiple colors
- **Adventure Games**: Explore worlds and discover secrets

## Technical Architecture

- **Frontend**: React + TypeScript with Tailwind CSS
- **Backend**: Node.js + Express
- **Game Engine**: HTML5 Canvas with custom game generator
- **Voice Processing**: Web Speech Recognition API
- **Storage**: In-memory (no database required)

## Project Structure

```
voice-builder/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities and game engine
│   │   └── pages/       # App pages
├── server/          # Express backend
│   ├── services/    # Game generation logic
│   └── routes.ts    # API endpoints
├── shared/          # Shared types and schemas
└── package.json
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking

### Adding New Game Types

1. Add game type to `server/services/localGameGenerator.ts`
2. Create game template with colors, characters, objectives
3. Add game logic to `server/services/gameGenerator.ts`
4. Update keyword detection for voice recognition

## Deployment

The app can be deployed to any Node.js hosting platform:

1. Build the project: `npm run build`
2. Set NODE_ENV=production
3. Start with: `npm run start`

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Partial (voice recognition may be limited)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with voice commands
5. Submit a pull request

## License

MIT License - feel free to use this for educational purposes or with your own children!

## Tips for Parents

- Encourage simple, clear speech
- Start with basic commands like "frog jump" or "car race"
- Let children experiment with different combinations
- Help them understand the microphone needs permission
- Most importantly: have fun creating together!

---

Made with ❤️ for young creators