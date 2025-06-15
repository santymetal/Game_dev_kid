# Local Setup Instructions

Follow these steps to run the Voice Builder on your local machine.

## Prerequisites

1. **Node.js 18+** - Download from https://nodejs.org/
2. **Git** - Download from https://git-scm.com/
3. **Modern browser** with microphone support (Chrome, Firefox, Safari, Edge)

## Step-by-Step Setup

### 1. Download the Code

```bash
# Clone your repository (replace with your actual GitHub URL)
git clone https://github.com/yourusername/voice-builder.git
cd voice-builder
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including React, Express, and other dependencies.

### 3. Start the Application

```bash
npm run dev
```

You should see output like:
```
[express] serving on port 5000
```

### 4. Open in Browser

Navigate to: `http://localhost:5000`

### 5. Enable Microphone

When you first click the microphone button, your browser will ask for permission to access your microphone. Click "Allow" to enable voice recognition.

## Testing the Voice Builder

Try these voice commands:

1. Click the big microphone button
2. Say one of these phrases:
   - "I want a jumping frog game"
   - "Make a car racing game"
   - "Create a color puzzle"
   - "Draw and paint game"
   - "Collect treasure adventure"
3. Click the microphone again to stop
4. Watch your game get created!

## Troubleshooting

### Microphone Not Working
- Check browser permissions
- Try refreshing the page
- Ensure microphone is not muted
- Test in Chrome/Edge first (best voice support)

### Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Port Already in Use
If port 5000 is busy, the app will automatically try other ports. Check the console output for the actual port being used.

### No Games Generated
- Speak clearly and slowly
- Use simple words like "frog jump" or "car race"
- Check browser console for any errors (F12 → Console tab)

## Production Build

To create a production version:

```bash
npm run build
npm run start
```

## File Structure

```
voice-builder/
├── README.md           # Main documentation
├── package.json        # Dependencies and scripts
├── client/            # Frontend React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Voice recognition logic
│   │   ├── lib/          # Game engine
│   │   └── pages/        # Main app page
├── server/            # Backend Express server
│   ├── services/      # Game generation logic
│   └── routes.ts      # API endpoints
└── shared/           # Shared types between frontend/backend
```

## Need Help?

The app is designed for 5-year-olds, so it should be very simple! If you have issues:

1. Try the voice commands listed above
2. Check that your microphone works in other apps
3. Use a modern browser (Chrome recommended)
4. Speak clearly and use simple words

Have fun creating games with your child!