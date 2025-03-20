import { BoxGeometry, Mesh, MeshPhongMaterial, Group, Vector3 } from 'three';

export class BoatSystem {
    constructor() {
        this.boat = this.createBoat();
        this.speed = 0.2;
        this.rotationSpeed = 0.03;
        this.moveForward = false;
        this.moveBackward = false;
        this.turnLeft = false;
        this.turnRight = false;
        this.isDriving = true;
        this.direction = new Vector3(0, 0, -1);
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

    update(deltaTime) {
        if (!this.isDriving) return;

        // Update rotation
        if (this.turnLeft) {
            this.boat.rotation.y += this.rotationSpeed;
        }
        if (this.turnRight) {
            this.boat.rotation.y -= this.rotationSpeed;
        }

        // Calculate movement direction based on boat's rotation
        const moveDirection = new Vector3();
        if (this.moveForward || this.moveBackward) {
            moveDirection.copy(this.direction);
            moveDirection.applyAxisAngle(new Vector3(0, 1, 0), this.boat.rotation.y);
            
            const speedMultiplier = this.moveForward ? this.speed : -this.speed;
            this.boat.position.add(moveDirection.multiplyScalar(speedMultiplier));
        }
    }

    handleKeyDown(event) {
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
                this.isDriving = !this.isDriving;
                break;
        }
    }

    getBoat() {
        return this.boat;
    }

    getPosition() {
        return this.boat.position;
    }

    getRotation() {
        return this.boat.rotation;
    }

    isDrivingMode() {
        return this.isDriving;
    }

    setDrivingMode(isDriving) {
        this.isDriving = isDriving;
    }
} 