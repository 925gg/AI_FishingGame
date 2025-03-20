import { BoxGeometry, Mesh, MeshPhongMaterial, Group, Vector3 } from 'three';

export class BoatSystem {
    constructor() {
        this.boat = this.createBoat();
        this.speed = 0.1;
        this.rotationSpeed = 0.03;
        this.moveForward = false;
        this.moveBackward = false;
        this.turnLeft = false;
        this.turnRight = false;
        this.isDriving = true; // Start in driving mode
    }

    createBoat() {
        const boatGroup = new Group();

        // Create boat hull
        const hullGeometry = new BoxGeometry(2, 0.5, 4);
        const hullMaterial = new MeshPhongMaterial({ color: 0x8B4513 });
        const hull = new Mesh(hullGeometry, hullMaterial);
        hull.position.y = 0.25;
        hull.castShadow = true;
        hull.receiveShadow = true;

        // Create boat cabin
        const cabinGeometry = new BoxGeometry(1.2, 0.8, 1.5);
        const cabinMaterial = new MeshPhongMaterial({ color: 0xA0522D });
        const cabin = new Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 0.8, -0.5);
        cabin.castShadow = true;

        boatGroup.add(hull);
        boatGroup.add(cabin);
        boatGroup.position.y = 0.5; // Float above water

        return boatGroup;
    }

    getBoat() {
        return this.boat;
    }

    setDrivingMode(isDriving) {
        this.isDriving = isDriving;
    }

    isDrivingMode() {
        return this.isDriving;
    }

    update(deltaTime) {
        if (!this.isDriving) return;

        if (this.moveForward) {
            this.boat.translateZ(-this.speed);
        }
        if (this.moveBackward) {
            this.boat.translateZ(this.speed);
        }
        if (this.turnLeft) {
            this.boat.rotation.y += this.rotationSpeed;
        }
        if (this.turnRight) {
            this.boat.rotation.y -= this.rotationSpeed;
        }
    }

    handleKeyDown(event) {
        if (!this.isDriving) return;

        switch (event.code) {
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'KeyA':
                this.turnLeft = true;
                break;
            case 'KeyD':
                this.turnRight = true;
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'KeyA':
                this.turnLeft = false;
                break;
            case 'KeyD':
                this.turnRight = false;
                break;
            case 'KeyF':
                // Toggle between driving and fishing mode
                this.isDriving = !this.isDriving;
                break;
        }
    }

    getPosition() {
        return this.boat.position;
    }

    getRotation() {
        return this.boat.rotation;
    }
} 