# Deployment Guide

This guide covers deploying Voice Builder to various platforms.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5000
```

## Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Platform Deployment

### Vercel

1. Fork the repository to your GitHub account
2. Connect your GitHub account to Vercel
3. Import the project
4. Set build command: `npm run build`
5. Set output directory: `dist/public`
6. Deploy

### Netlify

1. Fork the repository
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist/public`
5. Deploy

### Railway

1. Fork the repository
2. Connect to Railway
3. Set start command: `npm run start`
4. Set build command: `npm run build`
5. Deploy

### Heroku

1. Fork the repository
2. Create new Heroku app
3. Add Node.js buildpack
4. Set config vars if needed
5. Deploy from GitHub

## Environment Variables

Voice Builder works completely offline by default. No API keys required.

Optional environment variables:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## Performance Considerations

- Enable gzip compression in production
- Use CDN for static assets if needed
- Consider adding service worker for offline functionality
- Optimize audio context for mobile devices

## Browser Compatibility

Voice Builder requires:
- Modern browser with Web Speech API support
- Audio context support for sound effects
- ES6+ JavaScript support

Tested browsers:
- Chrome 80+
- Firefox 76+
- Safari 14+
- Edge 80+

## Mobile Deployment

For optimal mobile experience:
- Test touch interactions thoroughly
- Verify voice recognition on mobile
- Ensure audio works with device speakers
- Test landscape/portrait orientations

## Security Notes

- No sensitive data is stored or transmitted
- All processing happens client-side
- Voice data is not recorded or sent to servers
- Safe for children's privacy