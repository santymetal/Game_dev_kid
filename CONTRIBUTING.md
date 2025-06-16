# Contributing to Voice Builder

Thank you for your interest in contributing to Voice Builder! This project aims to create engaging, educational experiences for young children through voice-enabled game creation.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Make your changes
6. Test thoroughly with the target audience in mind (5-year-olds)

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Keep functions small and focused
- Add comments for complex logic
- Ensure accessibility for young users

### Child-Friendly Design Principles

When contributing, always consider:

- **Simplicity**: Can a 5-year-old understand this?
- **Visual Clarity**: Are buttons large enough for small fingers?
- **Audio Feedback**: Does every interaction provide sound feedback?
- **Error Recovery**: Can children easily recover from mistakes?
- **Celebration**: Does success feel rewarding?

### Testing

- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Verify voice recognition works across different accents
- Ensure touch interactions work on tablets
- Test with actual children when possible

### Sound System

All audio uses Web Audio API. When adding sounds:

- Keep volumes child-appropriate (not too loud)
- Use pleasant, non-jarring frequencies
- Provide audio for all user interactions
- Test with speakers and headphones

## Types of Contributions

### New Game Types

When adding new game types:

1. Add the type to `GameInterpretation` interface
2. Create construction steps in the routing logic
3. Generate appropriate game code
4. Test with voice commands
5. Add sound effects for game actions

### UI Improvements

Focus on:
- Larger buttons for easier clicking
- Brighter, more engaging colors
- Clearer visual feedback
- Better progress indicators

### Accessibility

Consider:
- Screen reader compatibility
- Keyboard navigation
- Color contrast for visual impairments
- Alternative input methods

## Pull Request Process

1. Create a descriptive branch name (`feature/new-puzzle-game`)
2. Make focused commits with clear messages
3. Update documentation if needed
4. Test thoroughly
5. Submit pull request with:
   - Clear description of changes
   - Screenshots/videos if UI changes
   - Testing notes
   - Child safety considerations

## Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] UI is child-friendly (large buttons, bright colors)
- [ ] All interactions have sound effects
- [ ] Error messages are simple and encouraging
- [ ] No external dependencies that could break offline functionality
- [ ] Performance is suitable for slower devices
- [ ] Cross-browser compatibility verified

## Reporting Issues

When reporting bugs:

1. Include browser version and operating system
2. Describe steps to reproduce
3. Note if issue affects children's ability to use the app
4. Include console errors if applicable
5. Suggest child-friendly error messaging

## Community Guidelines

- Be respectful and inclusive
- Remember the target audience is young children
- Focus on educational value
- Prioritize safety and privacy
- Keep discussions constructive

## Questions?

Feel free to open an issue for questions about:
- Technical implementation
- Child development considerations
- Accessibility requirements
- Feature suggestions

Thank you for helping create magical experiences for young creators!