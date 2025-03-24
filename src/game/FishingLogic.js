import * as THREE from 'three';
import { createFishMesh, getRandomFishType } from './FishTypes.js';
import SkillCheck from './SkillCheck.js';

class FishingLogic {
    constructor(scene, waterSurface, gameState, fishingRod) {
        this.scene = scene;
        this.waterSurface = waterSurface;
        this.gameState = gameState;
        this.fishingRod = fishingRod;
        
        // Store original rod position and rotation for animations
        this.originalRodPosition = fishingRod.position.clone();
        this.originalRodRotation = fishingRod.rotation.clone();
        
        // Rod animation properties
        this.isRodAnimating = false;
        this.rodAnimationTime = 0;
        this.rodAnimationType = null; // 'cast' or 'reel'
        this.rodAnimationTarget = new THREE.Vector3();
        this.rodAnimationDuration = 0.8; // seconds
        
        this.fishPool = [];
        this.activeFish = [];
        this.fishLine = null;
        this.fishHook = null;
        this.bobber = null;
        
        // Initialize fishing gear
        this.createFishingGear();
        
        // Initialize skill check
        this.skillCheck = new SkillCheck();
        
        // Boundaries for fish movement
        this.waterBounds = {
            minX: -45,
            maxX: 45,
            minZ: -45,
            maxZ: 45,
            y: -5 // Fixed depth for fish
        };
    }
    
    createFishingGear() {
        // Create fishing line (thin cylinder)
        const lineGeometry = new THREE.CylinderGeometry(0.005, 0.005, 10, 8);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        this.fishLine = new THREE.Mesh(lineGeometry, lineMaterial);
        this.fishLine.visible = false;
        this.scene.add(this.fishLine);
        
        // Create hook (torus)
        const hookGeometry = new THREE.TorusGeometry(0.03, 0.01, 8, 16, Math.PI * 1.5);
        const hookMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
        this.fishHook = new THREE.Mesh(hookGeometry, hookMaterial);
        this.fishHook.visible = false;
        this.scene.add(this.fishHook);
        
        // Create bobber (sphere)
        const bobberGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const bobberMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        this.bobber = new THREE.Mesh(bobberGeometry, bobberMaterial);
        this.bobber.visible = false;
        this.scene.add(this.bobber);
    }
    
    castLine(originPoint, targetPoint) {
        if (!this.gameState.startFishing()) {
            return false;
        }
        
        // Start rod casting animation
        this.startRodAnimation('cast', targetPoint);
        
        // Make fishing gear visible
        this.fishLine.visible = true;
        this.fishHook.visible = true;
        this.bobber.visible = true;
        
        // Get rod tip position from parent object
        const rodTip = new THREE.Vector3(0, -0.75, 0); // Rod tip in local space
        const rodTipWorld = rodTip.clone();
        this.fishingRod.localToWorld(rodTipWorld); // Convert to world position
        
        // Position fishing line
        this.fishLine.position.copy(rodTipWorld);
        this.fishLine.lookAt(targetPoint);
        
        // Adjust fishing line length and position
        const distance = rodTipWorld.distanceTo(targetPoint);
        this.fishLine.scale.set(1, distance / 10, 1);
        this.fishLine.position.lerp(targetPoint, 0.5);
        
        // Position hook and bobber at target point
        this.fishHook.position.copy(targetPoint);
        this.fishHook.position.y -= 0.1;
        
        this.bobber.position.copy(targetPoint);
        
        // Start the fishing minigame after a random delay
        const fishDelay = 2000 + Math.random() * 5000; // 2-7 seconds
        setTimeout(() => this.fishBite(), fishDelay);
        
        return true;
    }
    
    fishBite() {
        if (!this.gameState.isFishing) return;
        
        // Select a random fish
        const fishType = getRandomFishType();
        this.gameState.caughtFish = fishType;
        
        // Visual indicator - bobber moves
        this.animateBobber();

        // Start skill check
        this.skillCheck.start(
            fishType.catchDifficulty,
            (scoreMultiplier) => this.handleCatchSuccess(scoreMultiplier),
            () => this.handleCatchFail()
        );
    }
    
    animateBobber() {
        if (!this.gameState.isFishing) return;
        
        // Make bobber bob up and down to indicate fish bite
        const startY = this.bobber.position.y;
        let direction = -1;
        let bobCount = 0;
        
        const bobInterval = setInterval(() => {
            if (!this.gameState.isFishing || bobCount >= 10) {
                clearInterval(bobInterval);
                return;
            }
            
            this.bobber.position.y += direction * 0.05;
            
            if (this.bobber.position.y <= startY - 0.1 || this.bobber.position.y >= startY + 0.1) {
                direction *= -1;
                bobCount++;
            }
        }, 100);
    }
    
    handleCatchSuccess(scoreMultiplier) {
        if (!this.gameState.isFishing || !this.gameState.caughtFish) {
            this.endFishing(false);
            return;
        }

        // Calculate score with multiplier
        const basePoints = this.gameState.caughtFish.points;
        const finalPoints = Math.floor(basePoints * scoreMultiplier);
        
        // Add score based on caught fish
        this.gameState.addScore(finalPoints);
        
        // Start rod reeling animation
        this.startRodAnimation('reel', this.bobber.position);
        
        // Create a caught fish and animate it coming out of water
        const fishMesh = createFishMesh(this.gameState.caughtFish);
        fishMesh.position.copy(this.bobber.position);
        this.scene.add(fishMesh);
        
        // Animate fish being caught
        const startPos = fishMesh.position.clone();
        const endPos = new THREE.Vector3(0, 1, -2); // Move above the dock
        
        let progress = 0;
        const catchAnimation = setInterval(() => {
            progress += 0.05;
            
            if (progress >= 1) {
                clearInterval(catchAnimation);
                this.scene.remove(fishMesh);
                this.endFishing(true);
                return;
            }
            
            fishMesh.position.lerpVectors(startPos, endPos, progress);
            fishMesh.rotation.y += 0.1; // Make fish spin as it's pulled out
        }, 50);
    }

    handleCatchFail() {
        // Penalty for missing
        this.gameState.addScore(-20);
        
        // Visual feedback for penalty
        const penaltyText = document.createElement('div');
        penaltyText.textContent = '-20 points!';
        penaltyText.style.position = 'absolute';
        penaltyText.style.color = 'red';
        penaltyText.style.fontSize = '24px';
        penaltyText.style.fontWeight = 'bold';
        penaltyText.style.left = '50%';
        penaltyText.style.top = '50%';
        penaltyText.style.transform = 'translate(-50%, -50%)';
        penaltyText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(penaltyText);
        
        // Remove the text after a short delay
        setTimeout(() => {
            document.body.removeChild(penaltyText);
        }, 1500);
        
        // End fishing after penalty
        this.endFishing(false);
    }
    
    reelIn() {
        if (!this.gameState.isFishing || !this.gameState.caughtFish) {
            this.endFishing(false);
            return false;
        }
        
        // Start rod reeling animation
        this.startRodAnimation('reel', this.bobber.position);
        
        // Add score based on caught fish
        this.gameState.addScore(this.gameState.caughtFish.points);
        
        // Create a caught fish and animate it coming out of water
        const fishMesh = createFishMesh(this.gameState.caughtFish);
        fishMesh.position.copy(this.bobber.position);
        this.scene.add(fishMesh);
        
        // Animate fish being caught
        const startPos = fishMesh.position.clone();
        const endPos = new THREE.Vector3(0, 1, -2); // Move above the dock
        
        let progress = 0;
        const catchAnimation = setInterval(() => {
            progress += 0.05;
            
            if (progress >= 1) {
                clearInterval(catchAnimation);
                this.scene.remove(fishMesh);
                this.endFishing(true);
                return;
            }
            
            fishMesh.position.lerpVectors(startPos, endPos, progress);
            fishMesh.rotation.y += 0.1; // Make fish spin as it's pulled out
        }, 50);
        
        return true;
    }
    
    endFishing(success) {
        // Hide fishing gear
        this.fishLine.visible = false;
        this.fishHook.visible = false;
        this.bobber.visible = false;
        
        // Reset game state
        this.gameState.stopFishing();
    }
    
    spawnFish(count = 20) {
        // Clear any existing fish
        this.activeFish.forEach(fish => this.scene.remove(fish.mesh));
        this.activeFish = [];
        
        // Spawn new fish
        for (let i = 0; i < count; i++) {
            const fishType = getRandomFishType();
            const fishMesh = createFishMesh(fishType);
            
            // Random position under water
            const x = Math.random() * (this.waterBounds.maxX - this.waterBounds.minX) + this.waterBounds.minX;
            const z = Math.random() * (this.waterBounds.maxZ - this.waterBounds.minZ) + this.waterBounds.minZ;
            fishMesh.position.set(x, this.waterBounds.y, z);
            
            // Random rotation
            fishMesh.rotation.y = Math.random() * Math.PI * 2;
            
            this.scene.add(fishMesh);
            
            this.activeFish.push({
                mesh: fishMesh,
                type: fishType,
                direction: new THREE.Vector3(
                    Math.random() * 2 - 1,
                    0,
                    Math.random() * 2 - 1
                ).normalize(),
                speed: fishType.moveSpeed
            });
        }
    }
    
    updateFish(deltaTime) {
        // Move each fish
        this.activeFish.forEach(fish => {
            // Move fish in its current direction
            fish.mesh.position.x += fish.direction.x * fish.speed;
            fish.mesh.position.z += fish.direction.z * fish.speed;
            
            // Rotate fish to face movement direction
            fish.mesh.rotation.y = Math.atan2(fish.direction.x, fish.direction.z);
            
            // Check boundaries and change direction if needed
            if (fish.mesh.position.x <= this.waterBounds.minX || fish.mesh.position.x >= this.waterBounds.maxX) {
                fish.direction.x *= -1;
            }
            
            if (fish.mesh.position.z <= this.waterBounds.minZ || fish.mesh.position.z >= this.waterBounds.maxZ) {
                fish.direction.z *= -1;
            }
            
            // Occasionally change direction randomly
            if (Math.random() < 0.01) {
                fish.direction.x = Math.random() * 2 - 1;
                fish.direction.z = Math.random() * 2 - 1;
                fish.direction.normalize();
            }
        });
    }
    
    // New methods for rod animation
    startRodAnimation(type, targetPoint) {
        this.isRodAnimating = true;
        this.rodAnimationTime = 0;
        this.rodAnimationType = type;
        this.rodAnimationTarget = targetPoint.clone();
    }
    
    updateRodAnimations(deltaTime) {
        if (!this.isRodAnimating) return;
        
        this.rodAnimationTime += deltaTime;
        const progress = Math.min(this.rodAnimationTime / this.rodAnimationDuration, 1);
        
        if (this.rodAnimationType === 'cast') {
            // Casting animation - rod moves forward and down
            const castRotationX = this.originalRodRotation.x + Math.PI / 3 * Math.sin(progress * Math.PI);
            this.fishingRod.rotation.x = castRotationX;
            
            // Return to original position when animation completes
            if (progress >= 1) {
                this.isRodAnimating = false;
                setTimeout(() => {
                    this.fishingRod.rotation.copy(this.originalRodRotation);
                }, 500);
            }
        } else if (this.rodAnimationType === 'reel') {
            // Reeling animation - rod pulls up then returns to position
            const reelRotationX = this.originalRodRotation.x - Math.PI / 4 * Math.sin(progress * Math.PI);
            this.fishingRod.rotation.x = reelRotationX;
            
            // Small side-to-side movement
            const sideMovement = Math.sin(progress * Math.PI * 4) * 0.05;
            this.fishingRod.rotation.z = sideMovement;
            
            // Return to original position when animation completes
            if (progress >= 1) {
                this.isRodAnimating = false;
                this.fishingRod.rotation.copy(this.originalRodRotation);
            }
        }
    }
}

export default FishingLogic; 