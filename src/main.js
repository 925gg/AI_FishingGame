import { GameScene } from './scenes/GameScene.js';

// Initialize game
const gameScene = new GameScene();

// Animation loop
function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Update scene
    gameScene.update(currentTime);
}

// Start the animation
animate(0); 