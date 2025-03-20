import * as THREE from 'three';
import GameState from './game/GameState.js';
import FishingLogic from './game/FishingLogic.js';
import UI from './game/UI.js';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add sky background
scene.background = new THREE.Color(0x87CEEB);

// Create water plane
const waterGeometry = new THREE.PlaneGeometry(100, 100);
const waterMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x1E90FF,
    transparent: true,
    opacity: 0.8
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2; // Rotate to be horizontal
water.position.y = -2; // Position below the camera
scene.add(water);

// Create wooden dock
const dockGeometry = new THREE.BoxGeometry(3, 0.2, 4);
const dockMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const dock = new THREE.Mesh(dockGeometry, dockMaterial);
dock.position.set(0, -1.5, -2); // Position dock below and closer to camera
scene.add(dock);

// Add dock posts
for (let i = 0; i < 4; i++) {
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const postMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    
    // Position posts at corners of the dock
    const xPos = i % 2 === 0 ? -1.4 : 1.4;
    const zPos = i < 2 ? -3.8 : 0.2;
    
    post.position.set(xPos, -1.5, zPos);
    scene.add(post);
}

// Create a fishing rod (cylinder)
const rodGeometry = new THREE.CylinderGeometry(0.01, 0.02, 1.5, 32);
const rodMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const fishingRod = new THREE.Mesh(rodGeometry, rodMaterial);

// Position the rod in first-person view
fishingRod.position.set(0.3, -0.5, -0.7);
fishingRod.rotation.set(Math.PI / 6, 0, 0); // Angle the rod forward slightly

scene.add(fishingRod);

// Position camera
camera.position.y = -0.5;
camera.position.z = 0;
camera.rotation.x = Math.PI / 12; // Tilt camera down slightly to see the water

// Initialize game state
const gameState = new GameState();
const ui = new UI(gameState);
const fishingLogic = new FishingLogic(scene, water, gameState);

// Create raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event Listeners
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('keydown', onKeyDown, false);

// Handle start button click
ui.getStartButton().addEventListener('click', () => {
    // Show countdown before starting
    ui.showCountdown(3, () => {
        gameState.startGame();
        fishingLogic.spawnFish(20); // Spawn fish at game start
    });
});

// Handle mouse click for casting fishing line
function onMouseDown(event) {
    // Only allow casting if game is active and not already fishing
    if (!gameState.isGameActive || gameState.isFishing) return;
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with the water
    const intersects = raycaster.intersectObject(water);
    
    if (intersects.length > 0) {
        // Get intersection point
        const intersectPoint = intersects[0].point;
        
        // Calculate rod tip position (for line origin)
        const rodTipPosition = new THREE.Vector3(
            fishingRod.position.x,
            fishingRod.position.y - fishingRod.geometry.parameters.height / 2,
            fishingRod.position.z
        );
        
        // Cast the line
        fishingLogic.castLine(rodTipPosition, intersectPoint);
    }
}

// Handle key press for reeling in fish
function onKeyDown(event) {
    // Space bar to catch fish
    if (event.code === 'Space' && gameState.isFishing && gameState.caughtFish) {
        fishingLogic.reelIn();
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Game clock
let lastTime = 0;

// Animation loop
function animate(time) {
    requestAnimationFrame(animate);
    
    // Calculate delta time in seconds
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;
    
    // Update game state
    gameState.updateTime(deltaTime);
    
    // Update fish movement
    fishingLogic.updateFish(deltaTime);
    
    // Update UI
    ui.update();
    
    // Render scene
    renderer.render(scene, camera);
}

// Start the animation
animate(0); 