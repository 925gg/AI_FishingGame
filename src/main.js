import { GameScene } from './game/scene.js';
import { CastingSystem } from './game/casting.js';

// Initialize game
const gameScene = new GameScene();
const castingSystem = new CastingSystem(gameScene.scene);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update scene
    gameScene.update();
    
    // Render scene
    gameScene.render();
}

// Start the animation
animate(); 