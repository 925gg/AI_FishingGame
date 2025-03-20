import * as THREE from 'three';
import GameManager from './game/GameManager.js';
import Fishing from './game/Fishing.js';

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
fishingRod.rotation.set(Math.PI / 6, 0, -Math.PI / 12); // Angle the rod forward and to the side
scene.add(fishingRod);

// Position camera
camera.position.y = -0.5;
camera.position.z = 0;
camera.rotation.x = Math.PI / 12; // Tilt camera down slightly to see the water

// Initialize game manager
const gameManager = new GameManager(scene, water.position.y);

// Initialize fishing mechanics
const fishing = new Fishing(scene, camera, fishingRod, water.position.y);

// Add catch fish event on reel in
document.addEventListener('mouseup', (event) => {
  if (event.button === 0) { // Left click
    const castPosition = fishing.getCastPosition();
    if (castPosition) {
      const caughtFish = gameManager.catchFish(castPosition);
      if (caughtFish) {
        // Display caught fish message
        const fishMessage = document.createElement('div');
        fishMessage.style.position = 'absolute';
        fishMessage.style.bottom = '20px';
        fishMessage.style.left = '50%';
        fishMessage.style.transform = 'translateX(-50%)';
        fishMessage.style.color = 'white';
        fishMessage.style.fontSize = '20px';
        fishMessage.style.fontFamily = 'Arial, sans-serif';
        fishMessage.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        fishMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        fishMessage.style.padding = '10px';
        fishMessage.style.borderRadius = '5px';
        fishMessage.innerHTML = `Caught a ${caughtFish.name}! +${caughtFish.points} points`;
        document.body.appendChild(fishMessage);
        
        // Remove message after 2 seconds
        setTimeout(() => {
          document.body.removeChild(fishMessage);
        }, 2000);
      }
    }
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update fishing mechanics
  fishing.update();
  
  // Update fish
  gameManager.updateFish();
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the animation
animate(); 