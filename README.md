# AI Fishing Game

A 3D fishing game built with Three.js where players cast their line and catch fish through a timing-based mini-game.

## Features (Planned)

- Drag-based casting mechanics with trajectory visualization
- Realistic water interaction and ripple effects
- Fish bite detection and mini-game trigger
- Timing-based reeling mini-game
- Success/failure outcomes with visual feedback

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

- `src/`
  - `main.js` - Main entry point
  - `game/` - Core game logic
    - `scene.js` - Scene setup and management
    - `casting.js` - Casting mechanics
    - `water.js` - Water simulation and effects
    - `fish.js` - Fish behavior and bite detection
    - `minigame.js` - Reeling mini-game
  - `utils/` - Utility functions and helpers
  - `assets/` - Game assets (models, textures, sounds)

## Technologies Used

- Three.js for 3D rendering
- Vite for build tooling
- Web Audio API for sound effects

## Development Status

Currently in early development, implementing core mechanics.
