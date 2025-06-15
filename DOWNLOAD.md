# Download and Setup Instructions

## Quick Start Guide

### Method 1: Direct Download from Replit

1. **Download all files** from this Replit workspace:
   - Click the three dots menu in Replit
   - Select "Download as zip"
   - Extract the zip file to your computer

2. **Clean up for GitHub**:
   ```bash
   # Remove Replit-specific files
   rm -f .replit replit.nix .config/
   rm -f package-lock.json  # Will be regenerated
   
   # Rename the GitHub-ready package.json
   mv package-github.json package.json
   ```

### Method 2: Manual File Copy

Copy these essential files to your local project:

**Root Files:**
- `package.json` (use the content from `package-github.json`)
- `README.md`
- `SETUP.md`
- `.gitignore`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `postcss.config.js`
- `components.json`

**Directories to copy entirely:**
- `client/` (complete folder)
- `server/` (complete folder)  
- `shared/` (complete folder)

## Local Setup Commands

```bash
# 1. Initialize your local repository
git init
git add .
git commit -m "Initial commit: Voice Builder for kids"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:5000
```

## GitHub Repository Setup

```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/yourusername/voice-builder.git
git branch -M main
git push -u origin main
```

## Verification Steps

1. **Check installation**:
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

2. **Test the app**:
   - Open `http://localhost:5000`
   - Click microphone button
   - Say "jumping frog game"
   - Verify game is generated

3. **Check voice recognition**:
   - Browser should ask for microphone permission
   - Words should appear in transcript box
   - Games should generate from voice input

## Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Troubleshooting

**Port conflicts**: App uses port 5000 by default. If busy, it will auto-select another port.

**Microphone issues**: 
- Chrome/Edge have best voice support
- HTTPS required for microphone on deployed sites
- Check browser permissions

**Missing dependencies**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## File Structure Summary

```
voice-builder/
├── README.md              # Main documentation
├── SETUP.md              # Setup instructions  
├── package.json          # Dependencies and scripts
├── .gitignore            # Git ignore rules
├── client/               # React frontend
│   ├── index.html
│   └── src/
│       ├── components/   # Voice interface, game builder
│       ├── hooks/        # Voice recognition logic
│       ├── lib/          # Game engine utilities
│       └── pages/        # Main application page
├── server/               # Express backend
│   ├── services/         # Local game generation
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # In-memory data storage
└── shared/               # Shared TypeScript types
    └── schema.ts         # Data models
```

The complete project is self-contained and requires no external APIs or databases to run.