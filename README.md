# AI Fishing Game

A simple 3D fishing game built with Three.js where players can catch different types of fish to earn points within a time limit.

## Features

- Four different fish types with varying point values and rarity
- First-person perspective from a fishing dock
- Time-based gameplay (60 seconds to catch as many fish as possible)
- Simple fishing mechanics (click to cast, press SPACE to reel in)
- Score tracking

## How to Play

1. Click the "Start Game" button to begin
2. Click on the water to cast your fishing line
3. Wait for a fish to bite (the red bobber will move)
4. Press SPACE when you see movement to catch the fish
5. Catch as many fish as possible before the timer runs out!

## Fish Types

- Common Fish (10 points) - Bluish gray, easiest to catch
- Rare Fish (30 points) - Gold colored, moderately difficult to catch
- Exotic Fish (50 points) - Red, challenging to catch
- Legendary Fish (100 points) - Purple, very difficult to catch and rare

## Development

This game is built with:
- Three.js for 3D rendering
- Vanilla JavaScript for game logic
- Vite for bundling

### Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.
