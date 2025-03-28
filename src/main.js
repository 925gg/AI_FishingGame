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

// Add islands in the background
function createIsland(x, z, size) {
    // Island base
    const islandGroup = new THREE.Group();
    islandGroup.position.set(x, -2, z);
    
    // Island body with more vertices for more natural shape
    const islandGeometry = new THREE.ConeGeometry(size, size * 0.7, 8);
    const sandMaterial = new THREE.MeshBasicMaterial({ color: 0xDEB887 });
    const island = new THREE.Mesh(islandGeometry, sandMaterial);
    island.rotation.x = Math.PI;
    island.position.y = -size * 0.35;
    
    // Add slight random rotation for more natural appearance
    island.rotation.z = Math.random() * 0.3;
    islandGroup.add(island);
    
    // Add sandy beach ring around the island
    const beachGeometry = new THREE.TorusGeometry(size * 0.9, size * 0.2, 8, 12);
    const beachMaterial = new THREE.MeshBasicMaterial({ color: 0xF5DEB3 });
    const beach = new THREE.Mesh(beachGeometry, beachMaterial);
    beach.rotation.x = Math.PI / 2;
    beach.position.y = -size * 0.1;
    islandGroup.add(beach);
    
    // Add vegetation (palm trees for larger islands)
    if (size > 3) {
        // Add multiple palm trees
        const treeCount = Math.floor(size * 0.7);
        
        for (let t = 0; t < treeCount; t++) {
            // Position the trees randomly on the island
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (size * 0.6);
            const treeX = Math.cos(angle) * distance;
            const treeZ = Math.sin(angle) * distance;
            
            // Palm tree trunk with slight lean
            const trunkHeight = size * 0.8 + (Math.random() * size * 0.3);
            const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, trunkHeight);
            const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.set(treeX, 0, treeZ);
            
            // Random trunk lean
            const leanX = (Math.random() - 0.5) * 0.3;
            const leanZ = (Math.random() - 0.5) * 0.3;
            trunk.rotation.set(leanX, 0, leanZ);
            islandGroup.add(trunk);
            
            // Palm tree leaves
            const leafCount = 5 + Math.floor(Math.random() * 3);
            for (let i = 0; i < leafCount; i++) {
                const leafGeometry = new THREE.ConeGeometry(0.6, size * 0.6, 4);
                
                // Vary leaf colors slightly
                const hueShift = (Math.random() - 0.5) * 0.1;
                const leafColor = new THREE.Color(0x2E8B57).offsetHSL(hueShift, 0.1, 0);
                const leafMaterial = new THREE.MeshBasicMaterial({ color: leafColor });
                
                const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
                
                // Fix leaf position - position relative to trunk top
                leaf.position.copy(trunk.position);
                leaf.position.y += trunkHeight * 0.5; // Lower position from 0.9 to 0.5
                
                // Position leaves in a radial pattern with some randomness
                const angle = (i / leafCount) * Math.PI * 2;
                const tilt = Math.PI / 3 + (Math.random() * 0.2);
                leaf.rotation.set(tilt, 0, angle);
                leaf.translateOnAxis(new THREE.Vector3(0, 1, 0), size * 0.25);
                
                islandGroup.add(leaf);
            }
        }
        
        // Add some rocks
        const rockCount = Math.floor(Math.random() * 4) + 2;
        for (let r = 0; r < rockCount; r++) {
            const rockSize = size * 0.15 * (Math.random() * 0.5 + 0.5);
            const rockGeometry = new THREE.DodecahedronGeometry(rockSize, 0);
            const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            // Position rocks around the shore
            const angle = Math.random() * Math.PI * 2;
            const distance = size * 0.7 + (Math.random() * size * 0.2);
            rock.position.set(
                Math.cos(angle) * distance,
                -size * 0.1 + (Math.random() * rockSize),
                Math.sin(angle) * distance
            );
            
            // Random rotation
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            islandGroup.add(rock);
        }
    } else {
        // Small island with varied vegetation
        const bushCount = Math.floor(Math.random() * 3) + 2;
        for (let b = 0; b < bushCount; b++) {
            // Vary the bush shapes
            const bushType = Math.random();
            let bushGeometry;
            
            if (bushType < 0.4) {
                // Sphere bush
                bushGeometry = new THREE.SphereGeometry(size * 0.25 * (Math.random() * 0.4 + 0.8), 8, 6);
            } else if (bushType < 0.7) {
                // Cone bush
                bushGeometry = new THREE.ConeGeometry(size * 0.2, size * 0.4, 6);
            } else {
                // Dodecahedron bush (more angular)
                bushGeometry = new THREE.DodecahedronGeometry(size * 0.2, 0);
            }
            
            // Vary green colors
            const hueShift = (Math.random() - 0.5) * 0.2;
            const bushColor = new THREE.Color(0x228B22).offsetHSL(hueShift, 0.1, (Math.random() - 0.5) * 0.1);
            const bushMaterial = new THREE.MeshBasicMaterial({ color: bushColor });
            const bush = new THREE.Mesh(bushGeometry, bushMaterial);
            
            // Position bushes randomly on small island
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (size * 0.5);
            bush.position.set(
                Math.cos(angle) * distance,
                size * 0.1 + (Math.random() * size * 0.1),
                Math.sin(angle) * distance
            );
            
            // Random rotation
            bush.rotation.set(0, Math.random() * Math.PI, 0);
            
            islandGroup.add(bush);
        }
        
        // Add a small rock
        if (Math.random() > 0.5) {
            const rockGeometry = new THREE.DodecahedronGeometry(size * 0.15, 0);
            const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            // Position rock near edge
            const angle = Math.random() * Math.PI * 2;
            rock.position.set(
                Math.cos(angle) * (size * 0.6),
                -size * 0.05,
                Math.sin(angle) * (size * 0.6)
            );
            
            // Random rotation
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            islandGroup.add(rock);
        }
    }
    
    scene.add(islandGroup);
}

// Create islands at different locations
createIsland(-20, -30, 5);  // Large island
createIsland(25, -40, 7);   // Large island
createIsland(-35, -20, 3);  // Medium island
createIsland(15, -15, 2);   // Small island
createIsland(30, -20, 2.5); // Medium island
createIsland(-15, -40, 4);  // Medium island

// Add clouds
function createCloud(x, y, z) {
    const cloudGroup = new THREE.Group();
    cloudGroup.position.set(x, y, z);
    
    // Create multiple spheres for each cloud
    const segments = 8;
    const cloudMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.9
    });
    
    // Main cloud parts
    const sizes = [
        { radius: 1.0, x: 0, y: 0, z: 0 },
        { radius: 0.8, x: 1.1, y: 0.2, z: 0 },
        { radius: 0.7, x: -1.0, y: 0, z: 0.2 },
        { radius: 0.6, x: 0.5, y: -0.2, z: 0.5 },
        { radius: 0.7, x: -0.5, y: 0.1, z: -0.5 }
    ];
    
    sizes.forEach(size => {
        const cloudPartGeometry = new THREE.SphereGeometry(size.radius, segments, segments);
        const cloudPart = new THREE.Mesh(cloudPartGeometry, cloudMaterial);
        cloudPart.position.set(size.x, size.y, size.z);
        cloudGroup.add(cloudPart);
    });
    
    scene.add(cloudGroup);
    return cloudGroup;
}

// Create clouds at different locations
const clouds = [
    createCloud(-15, 10, -40),
    createCloud(20, 12, -35),
    createCloud(-25, 8, -30),
    createCloud(10, 11, -45),
    createCloud(30, 9, -50),
    createCloud(-5, 13, -55)
];

// Animate clouds in the animation loop
function updateClouds(deltaTime) {
    clouds.forEach((cloud, index) => {
        // Move clouds slowly from side to side
        cloud.position.x += Math.sin((Date.now() / 10000) + index) * deltaTime * 0.3;
    });
}

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

// Add dock planks for more detail
const plankCount = 8;
const plankWidth = 3.0 / plankCount;
for (let i = 0; i < plankCount; i++) {
    const plankGeometry = new THREE.BoxGeometry(plankWidth - 0.05, 0.22, 4);
    // Slight color variation for each plank
    const woodColor = new THREE.Color(0x8B4513).offsetHSL(0, 0, Math.random() * 0.1 - 0.05);
    const plankMaterial = new THREE.MeshBasicMaterial({ color: woodColor });
    const plank = new THREE.Mesh(plankGeometry, plankMaterial);
    plank.position.set(-1.5 + plankWidth * (i + 0.5), -1.4, -2);
    scene.add(plank);
    
    // Add nail details at the ends of planks
    for (let j = 0; j < 2; j++) {
        const nailGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.05, 6);
        const nailMaterial = new THREE.MeshBasicMaterial({ color: 0x696969 });
        const nail = new THREE.Mesh(nailGeometry, nailMaterial);
        nail.rotation.x = Math.PI / 2;
        nail.position.set(
            plank.position.x,
            -1.3,
            -2 + (j === 0 ? -1.8 : 1.8)
        );
        scene.add(nail);
    }
}

// Add dock posts with more detail
for (let i = 0; i < 4; i++) {
    // Main post
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const postMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    
    // Position posts at corners of the dock
    const xPos = i % 2 === 0 ? -1.4 : 1.4;
    const zPos = i < 2 ? -3.8 : 0.2;
    
    post.position.set(xPos, -1.5, zPos);
    scene.add(post);
    
    // Add post rings for detail
    for (let j = 0; j < 2; j++) {
        const ringGeometry = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x5D4037 });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(xPos, -1.5 + (j === 0 ? -0.7 : 0.7), zPos);
        scene.add(ring);
    }
}

// Create a more detailed fishing rod
// Create parent object for all rod components
const rodParent = new THREE.Object3D();
rodParent.position.set(0.3, -0.5, -0.7);
rodParent.rotation.set(Math.PI / 6, 0, -Math.PI / 24); // Slight adjustment to rotation
rodParent.name = 'fishing_rod_parent';
scene.add(rodParent);

// Main rod body
const rodGeometry = new THREE.CylinderGeometry(0.01, 0.02, 1.5, 12);
const rodMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const fishingRod = new THREE.Mesh(rodGeometry, rodMaterial);

// Position the rod in first-person view - now relative to parent
fishingRod.position.set(0, 0, 0);
fishingRod.rotation.set(0, 0, 0);
fishingRod.name = 'fishing_rod_main';

rodParent.add(fishingRod);

// Add rod handle (grip)
const handleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 12);
const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x2F4F4F });
const handle = new THREE.Mesh(handleGeometry, handleMaterial);

// Position at the bottom of the rod
// Adjust position to connect with rod bottom
const rodBottomOffset = new THREE.Vector3(0, -fishingRod.geometry.parameters.height / 2, 0);
handle.position.copy(rodBottomOffset);
handle.name = 'rod_handle';
rodParent.add(handle);

// Add fishing reel
const reelBodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16, 1, false, 0, Math.PI);
const reelMaterial = new THREE.MeshBasicMaterial({ color: 0x696969 });
const reelBody = new THREE.Mesh(reelBodyGeometry, reelMaterial);

// Position the reel on the rod
// Calculate position halfway up from the handle
const reelOffset = new THREE.Vector3(0, -fishingRod.geometry.parameters.height / 4, 0);
// Position the reel to the side of the rod
const sideOffset = new THREE.Vector3(0.05, 0, 0);
reelBody.position.copy(reelOffset).add(sideOffset);

// Orient the reel perpendicular to the rod
reelBody.rotation.set(0, 0, Math.PI / 2);
reelBody.name = 'rod_reel_body';
rodParent.add(reelBody);

// Add reel handle
const reelHandleBaseGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8);
const reelHandleBase = new THREE.Mesh(reelHandleBaseGeometry, reelMaterial);
reelHandleBase.position.copy(reelBody.position);
// Position handle on the outer edge of the reel
const handleOffset = new THREE.Vector3(0, 0, 0.07);
handleOffset.applyQuaternion(reelBody.quaternion);
reelHandleBase.position.add(handleOffset);

reelHandleBase.rotation.copy(reelBody.rotation);
reelHandleBase.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
reelHandleBase.name = 'rod_reel_handle';
rodParent.add(reelHandleBase);

// Add knob to the handle
const reelKnobGeometry = new THREE.SphereGeometry(0.02, 8, 8);
const reelKnobMaterial = new THREE.MeshBasicMaterial({ color: 0xA0A0A0 });
const reelKnob = new THREE.Mesh(reelKnobGeometry, reelKnobMaterial);
reelKnob.position.copy(reelHandleBase.position);
// Position knob at the end of the handle
const knobOffset = new THREE.Vector3(0, 0, 0.04);
knobOffset.applyQuaternion(reelHandleBase.quaternion);
reelKnob.position.add(knobOffset);
reelKnob.name = 'rod_reel_knob';
rodParent.add(reelKnob);

// Add line guides to the rod
const lineGuidePositions = [0.2, -0.1, -0.4, -0.6];
lineGuidePositions.forEach((yOffset, index) => {
    // Create a small ring for the line guide
    const size = 0.02 - (index * 0.003); // Guides get slightly smaller toward the tip
    const guideGeometry = new THREE.TorusGeometry(size, 0.005, 8, 8);
    const guideMaterial = new THREE.MeshBasicMaterial({ color: 0x2F4F4F });
    const guide = new THREE.Mesh(guideGeometry, guideMaterial);
    
    // Position the guide on the rod
    // Calculate position along the rod
    const guideOffset = new THREE.Vector3(0, yOffset, 0);
    guide.position.copy(guideOffset);
    
    // Orient the guides perpendicular to the rod direction
    guide.rotation.set(0, 0, Math.PI / 2);
    
    guide.name = `rod_guide_${index}`;
    rodParent.add(guide);
});

// Position camera
camera.position.y = -0.5;
camera.position.z = 0;
camera.rotation.x = Math.PI / 12; // Tilt camera down slightly to see the water

// Initialize game state
const gameState = new GameState();
const ui = new UI(gameState);
const fishingLogic = new FishingLogic(scene, water, gameState, rodParent);

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
        
        // Cast the line to the intersection point
        fishingLogic.castLine(null, intersectPoint);
    }
}

// Handle key press for reeling in fish
function onKeyDown(event) {
    // Space bar to attempt catch
    if (event.code === 'Space' && gameState.isFishing) {
        fishingLogic.skillCheck.checkHit();
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
    
    // Update fishing rod animations
    fishingLogic.updateRodAnimations(deltaTime);
    
    // Update clouds animation
    updateClouds(deltaTime);
    
    // Update UI
    ui.update();
    
    // Render scene
    renderer.render(scene, camera);
}

// Start the animation
animate(0);

// Set up audio context resuming on interaction
document.addEventListener('click', function() {
    if (gameState && gameState.audioManager) {
        gameState.audioManager.resumeAudioContext();
    }
}, { once: false });

// Also try to resume on keydown
document.addEventListener('keydown', function() {
    if (gameState && gameState.audioManager) {
        gameState.audioManager.resumeAudioContext();
    }
}, { once: false }); 