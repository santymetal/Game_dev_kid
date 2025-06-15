# Voice Builder - Kids Game Creation Platform

## Overview

Voice Builder is an interactive web application that allows children (aged 5+) to create simple games using voice commands. The application uses AI to interpret a child's spoken game ideas and generates playable games with encouraging feedback. The system is designed to be intuitive, colorful, and engaging for young users.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query for server state, React hooks for local state
- **Build Tool**: Vite for fast development and optimized builds
- **UI Theme**: Child-friendly design with bright colors (coral, turquoise, sky, mint, etc.)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful endpoints
- **Middleware**: Express middleware for JSON parsing, CORS, and request logging
- **Error Handling**: Centralized error handling with custom status codes

### Data Storage Solutions
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Defined in shared/schema.ts with Zod validation
- **Migrations**: Drizzle Kit for database migrations
- **Development Storage**: In-memory storage fallback for development

### Key Database Tables
- `users`: Basic user authentication (id, username, password)
- `game_ideas`: Stores generated games (transcript, game type, config, creation timestamp)

## Key Components

### Voice Recognition System
- **Browser API**: Web Speech Recognition API
- **Fallback Support**: Graceful degradation for unsupported browsers
- **Languages**: Configurable language support (default: en-US)
- **Error Handling**: User-friendly error messages for voice recognition failures

### AI Integration
- **Provider**: Local keyword-based interpreter (no external APIs required)
- **Purpose**: Interprets children's spoken game ideas using simple keyword matching
- **Output**: JSON-formatted game specifications including type, theme, characters, and mechanics
- **Cost**: Completely free - no API keys or external services needed

### Game Generation Engine
- **Types Supported**: 
  - Jumping games (platformer-style)
  - Collection games (item gathering)
  - Racing games (speed-based)
  - Puzzle games (matching/solving)
  - Creative tools (drawing/art)
  - Adventure games (exploration)
- **Rendering**: HTML5 Canvas-based games
- **Controls**: Simple keyboard and mouse inputs appropriate for children

### UI Components
- **Voice Interface**: Large, friendly microphone button with visual feedback
- **Game Templates**: Pre-designed game type suggestions
- **Game Builder**: Interactive game preview and customization
- **Simple Game Player**: Full-screen canvas game player

## Data Flow

1. **Voice Input**: Child speaks into microphone → Browser captures speech → Converts to text
2. **AI Processing**: Text transcript → OpenAI API → Structured game interpretation
3. **Game Generation**: Game config → Game generator → Playable game code
4. **Storage**: Game idea and config saved to database
5. **Display**: Generated game presented to child with encouragement
6. **Gameplay**: Child can immediately play their created game

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm & drizzle-kit**: Database ORM and migrations
- **openai**: AI integration for game interpretation
- **express**: Web server framework
- **react & react-dom**: Frontend framework
- **@tanstack/react-query**: Server state management

### UI Dependencies
- **@radix-ui/***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible components
- **lucide-react**: Icon library
- **wouter**: Lightweight router

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Platform
- **Target**: Replit deployment with autoscaling
- **Build Process**: 
  1. `npm run build`: Vite builds frontend to `dist/public`
  2. `esbuild` bundles server code to `dist/index.js`
- **Production Start**: `npm run start` runs the bundled server
- **Port Configuration**: Internal port 5000, external port 80

### Environment Requirements
- **Node.js**: Version 20+
- **PostgreSQL**: Version 16+ (optional - uses in-memory storage by default)
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string (optional)
  - No external API keys required

### Development Setup
- **Command**: `npm run dev` starts development server with hot reload
- **Database**: `npm run db:push` applies schema changes
- **Type Checking**: `npm run check` validates TypeScript

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 15, 2025. Initial setup