import { PlaneGeometry, MeshPhongMaterial, Mesh, Vector3 } from 'three';

export class WaterSystem {
    constructor() {
        // Create water plane
        const geometry = new PlaneGeometry(100, 100, 50, 50);
        const material = new MeshPhongMaterial({
            color: 0x0077ff,
            transparent: true,
            opacity: 0.8,
            side: 2
        });
        
        this.waterMesh = new Mesh(geometry, material);
        this.waterMesh.rotation.x = -Math.PI / 2;
        this.waterMesh.position.y = -2;

        // Wave parameters
        this.time = 0;
        this.waveHeight = 0.2;
        this.waveSpeed = 1;
        this.waveLength = 2;
    }

    update(deltaTime) {
        this.time += deltaTime;
        
        // Update vertex positions for wave animation
        const positions = this.waterMesh.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            
            // Simple sine wave
            positions[i + 1] = Math.sin(x / this.waveLength + this.time * this.waveSpeed) * this.waveHeight;
        }
        
        this.waterMesh.geometry.attributes.position.needsUpdate = true;
    }

    getWaterMesh() {
        return this.waterMesh;
    }

    getWaterLevel() {
        return -2; // Base water level
    }
} 