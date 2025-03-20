import { SphereGeometry, Mesh, MeshPhongMaterial, Vector3, Quaternion } from 'three';

export class CastingSystem {
    constructor() {
        // Create bobber
        const bobberGeometry = new SphereGeometry(0.2, 32, 32);
        const bobberMaterial = new MeshPhongMaterial({ color: 0xff0000 });
        this.bobber = new Mesh(bobberGeometry, bobberMaterial);
        this.bobber.castShadow = true;

        // Initialize position and rotation
        this.startPosition = new Vector3(0, 1, 0);
        this.startRotation = 0;
        this.bobber.position.copy(this.startPosition);

        // Casting variables
        this.isCasting = false;
        this.castStartTime = 0;
        this.castPower = 0;
        this.maxCastPower = 20;
        this.castPowerRate = 10; // Power increase per second
        this.gravity = 9.8;
        this.velocity = new Vector3();
    }

    setStartPosition(position, rotation) {
        // Set the start position slightly above and in front of the boat
        this.startPosition.copy(position);
        this.startPosition.y += 1; // Raise it above the boat
        this.startRotation = rotation;
        
        if (!this.isCasting) {
            this.bobber.position.copy(this.startPosition);
        }
    }

    startCast() {
        if (!this.isCasting) {
            this.isCasting = true;
            this.castStartTime = Date.now();
            this.castPower = 0;
            this.bobber.position.copy(this.startPosition);
        }
    }

    update(deltaTime) {
        if (this.isCasting) {
            const currentTime = Date.now();
            const castDuration = (currentTime - this.castStartTime) / 1000; // Convert to seconds
            
            this.castPower = Math.min(castDuration * this.castPowerRate, this.maxCastPower);
            
            // When spacebar is released, the cast will be completed in the onKeyUp handler
        } else if (this.velocity.length() > 0) {
            // Update position based on velocity
            this.bobber.position.x += this.velocity.x * deltaTime;
            this.bobber.position.y += this.velocity.y * deltaTime;
            this.bobber.position.z += this.velocity.z * deltaTime;
            
            // Apply gravity
            this.velocity.y -= this.gravity * deltaTime;
            
            // Stop if bobber hits the water
            if (this.bobber.position.y <= 0) {
                this.bobber.position.y = 0;
                this.velocity.set(0, 0, 0);
            }
        }
    }

    completeCast() {
        if (this.isCasting) {
            this.isCasting = false;
            
            // Calculate cast direction based on boat's rotation
            const castDirection = new Vector3(0, 0.5, -1);
            const rotationQuat = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), this.startRotation);
            castDirection.applyQuaternion(rotationQuat).normalize();
            
            // Set initial velocity based on cast power
            this.velocity.copy(castDirection).multiplyScalar(this.castPower);
        }
    }

    getBobber() {
        return this.bobber;
    }

    getBobberPosition() {
        return this.bobber.position;
    }
} 