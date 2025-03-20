import { SphereGeometry, MeshPhongMaterial, Mesh, Vector3 } from 'three';

export class CastingSystem {
    constructor() {
        // Create bobber
        const geometry = new SphereGeometry(0.2, 16, 16);
        const material = new MeshPhongMaterial({ color: 0xff0000 });
        this.bobber = new Mesh(geometry, material);
        this.bobber.position.set(0, 0, 0);

        // Casting parameters
        this.isCasting = false;
        this.castPower = 0;
        this.maxCastPower = 1;
        this.castSpeed = 2;
        this.reelSpeed = 3;
        this.maxCastDistance = 20;
        this.initialPosition = new Vector3(0, 0, 0);
        this.targetPosition = new Vector3(0, 0, 0);
    }

    startCast() {
        this.isCasting = true;
        this.castPower = 0;
        this.initialPosition.copy(this.bobber.position);
        this.targetPosition.set(
            this.initialPosition.x + Math.random() * this.maxCastDistance - this.maxCastDistance/2,
            0,
            this.initialPosition.z + Math.random() * this.maxCastDistance - this.maxCastDistance/2
        );
    }

    update(deltaTime) {
        if (this.isCasting) {
            // Increase cast power
            this.castPower = Math.min(this.castPower + deltaTime * this.castSpeed, this.maxCastPower);
            
            // Calculate current position
            const progress = this.castPower / this.maxCastPower;
            const height = Math.sin(progress * Math.PI) * 5; // Arc height
            
            this.bobber.position.x = this.initialPosition.x + (this.targetPosition.x - this.initialPosition.x) * progress;
            this.bobber.position.y = this.initialPosition.y + height;
            this.bobber.position.z = this.initialPosition.z + (this.targetPosition.z - this.initialPosition.z) * progress;

            // Check if cast is complete
            if (this.castPower >= this.maxCastPower) {
                this.isCasting = false;
                this.bobber.position.y = 0; // Place bobber on water surface
            }
        } else {
            // Reel in if not casting
            const direction = new Vector3().subVectors(this.initialPosition, this.bobber.position);
            if (direction.length() > 0.1) {
                direction.normalize().multiplyScalar(deltaTime * this.reelSpeed);
                this.bobber.position.add(direction);
            }
        }
    }

    getBobber() {
        return this.bobber;
    }

    getBobberPosition() {
        return this.bobber.position;
    }
} 