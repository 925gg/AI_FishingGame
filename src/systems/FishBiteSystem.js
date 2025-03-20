import { Vector3 } from 'three';

export class FishBiteSystem {
    constructor() {
        this.state = {
            isFishBiting: false,
            miniGameActive: false,
            miniGameSuccess: false,
            currentFish: null
        };

        this.biteTimer = 0;
        this.biteInterval = 3; // Time between potential bites
        this.biteDuration = 2; // How long the fish bites
        this.miniGameDuration = 5; // Time to complete mini-game
        this.miniGameTimer = 0;
        this.miniGameProgress = 0;
        this.miniGameTarget = 0.8; // Progress needed to catch fish

        this.fishTypes = [
            { type: 'Common Carp', weight: 2, value: 10 },
            { type: 'Bass', weight: 3, value: 15 },
            { type: 'Trout', weight: 1.5, value: 20 },
            { type: 'Salmon', weight: 4, value: 25 }
        ];
    }

    detectBite(bobberPosition, waterLevel) {
        // Check if bobber is at water level
        if (Math.abs(bobberPosition.y - waterLevel) > 0.1) {
            return false;
        }

        // Random chance to start biting
        if (!this.state.isFishBiting && this.biteTimer >= this.biteInterval) {
            const randomValue = Math.random();
            if (randomValue < 0.3) { // 30% chance to bite
                this.state.isFishBiting = true;
                this.biteTimer = 0;
                return true;
            }
        }

        return false;
    }

    update(deltaTime) {
        this.biteTimer += deltaTime;

        if (this.state.isFishBiting) {
            this.biteTimer += deltaTime;
            if (this.biteTimer >= this.biteDuration) {
                this.state.isFishBiting = false;
                return false;
            }
        }

        return true;
    }

    startMiniGame() {
        if (this.state.isFishBiting && !this.state.miniGameActive) {
            this.state.miniGameActive = true;
            this.miniGameTimer = 0;
            this.miniGameProgress = 0;
            this.state.currentFish = this.fishTypes[Math.floor(Math.random() * this.fishTypes.length)];
        }
    }

    updateMiniGame(deltaTime, isReeling) {
        if (!this.state.miniGameActive) return false;

        this.miniGameTimer += deltaTime;

        // Update progress based on reeling
        if (isReeling) {
            this.miniGameProgress += deltaTime * 0.5;
        } else {
            this.miniGameProgress -= deltaTime * 0.3;
        }

        // Clamp progress between 0 and 1
        this.miniGameProgress = Math.max(0, Math.min(1, this.miniGameProgress));

        // Check if mini-game is complete
        if (this.miniGameTimer >= this.miniGameDuration) {
            this.state.miniGameActive = false;
            this.state.miniGameSuccess = this.miniGameProgress >= this.miniGameTarget;
            return true;
        }

        return false;
    }

    getState() {
        return this.state;
    }
} 