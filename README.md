# Voice Builder - Kids Game Creation Platform

A voice-enabled creative platform that transforms a 5-year-old's spoken imagination into interactive games through an intuitive, child-friendly game construction system.

## 🎮 Features

- **Voice Recognition**: Children speak their game ideas using simple, natural language
- **Step-by-Step Construction**: Guided 4-step building process teaches decision-making
- **Interactive Sound Effects**: Engaging audio feedback designed for young children
- **Real-time Game Generation**: Custom games created based on child's choices
- **Child-Friendly Interface**: Large buttons, bright colors, and Comic Sans font
- **Offline Operation**: Works completely without external APIs or costs

## 🎯 Supported Game Types

- **Jumping Games**: Platformer-style adventures with character movement
- **Collection Games**: Gather items and score points
- **Racing Games**: Speed-based challenges
- **Puzzle Games**: Matching and problem-solving
- **Creative Tools**: Drawing and art creation
- **Adventure Games**: Exploration and discovery

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- Modern web browser with Web Speech API support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voice-builder.git
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

### Windows Setup

For Windows users, use the provided setup script:
```bash
./setup-windows.bat
```

This uses the minimal package configuration to avoid dependency conflicts.

## 🎵 Sound System

The application includes comprehensive audio feedback:

- **Jump sounds** when characters leap in games
- **Collection sounds** when gathering items
- **Button click sounds** for all interactions
- **Success sounds** after each construction step
- **Celebration sounds** when games finish building
- **Listening sound** when voice recognition starts

All sounds are generated using the Web Audio API with no external files required.

## 🏗️ Architecture

### Frontend
- **React + TypeScript** for the user interface
- **Tailwind CSS** with shadcn/ui components
- **Wouter** for lightweight routing
- **React Query** for server state management
- **Vite** for fast development builds

### Backend
- **Node.js + Express** server
- **TypeScript** with ES modules
- **In-memory storage** for development (PostgreSQL ready)
- **RESTful API** endpoints

### Game Engine
- **HTML5 Canvas** for game rendering
- **Custom game engine** with physics and collision detection
- **Dynamic code generation** based on user choices

## 🎨 Design Philosophy

Built specifically for 5-year-olds with:
- **Large, colorful buttons** that are easy to click
- **Simple language** in all instructions
- **Visual progress indicators** to show construction steps
- **Immediate feedback** through sounds and animations
- **Celebration sequences** to reward completion

## 🔧 Development

### Project Structure

```
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Application pages
│   │   └── lib/         # Utilities and game engine
├── server/          # Backend Express server
│   ├── services/    # Game generation logic
│   └── routes.ts    # API endpoints
├── shared/          # Shared types and schemas
└── package.json     # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

### Game Construction Process

1. **Voice Input**: Child speaks game idea
2. **Game Type Detection**: Simple keyword matching identifies game type
3. **Step-by-Step Building**: 4 guided construction steps
4. **Custom Generation**: Game code created with user choices
5. **Immediate Play**: Child can play their custom game instantly

## 🌟 Educational Value

Voice Builder teaches children:
- **Decision-making skills** through construction choices
- **Cause and effect** by seeing how choices affect their game
- **Creative expression** through game design
- **Technology interaction** in a safe, guided environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with child development principles in mind
- Designed for accessibility and engagement
- Inspired by the belief that the best way to understand something is to explain it to a 5-year-old

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/voice-builder/issues) page
2. Create a new issue with detailed description
3. Include browser version and error messages if applicable

---

**Made with ❤️ for young creators and their endless imagination**