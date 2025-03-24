import * as THREE from 'three';

// Fish types with their properties
const FishTypes = [
    {
        id: 'common',
        name: 'Common Fish',
        points: 10,
        catchDifficulty: 1, // Lower means easier to catch
        color: 0x7B9DB7, // Bluish gray
        size: { length: 0.3, height: 0.1, width: 0.05 },
        spawnChance: 0.5, // 50% chance to spawn
        moveSpeed: 0.03
    },
    {
        id: 'rare',
        name: 'Rare Fish',
        points: 30,
        catchDifficulty: 2,
        color: 0xFFD700, // Gold
        size: { length: 0.4, height: 0.15, width: 0.07 },
        spawnChance: 0.3, // 30% chance to spawn
        moveSpeed: 0.05
    },
    {
        id: 'exotic',
        name: 'Exotic Fish',
        points: 50,
        catchDifficulty: 3,
        color: 0xFF6347, // Tomato red
        size: { length: 0.5, height: 0.2, width: 0.1 },
        spawnChance: 0.15, // 15% chance to spawn
        moveSpeed: 0.07
    },
    {
        id: 'legendary',
        name: 'Legendary Fish',
        points: 100,
        catchDifficulty: 5,
        color: 0x9400D3, // Purple
        size: { length: 0.6, height: 0.25, width: 0.12 },
        spawnChance: 0.05, // 5% chance to spawn
        moveSpeed: 0.09
    }
];

// Helper function to create a fish mesh based on fish type
function createFishMesh(fishType) {
    // Create a group to hold the fish parts
    const fishGroup = new THREE.Group();
    
    // Create the fish body - main part with slightly rounded edges
    const bodyGeometry = new THREE.BoxGeometry(
        fishType.size.length * 0.7,
        fishType.size.height,
        fishType.size.width
    );
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: fishType.color });
    const fishBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    fishGroup.add(fishBody);
    
    // Create the fish head - tapered front
    const headGeometry = new THREE.ConeGeometry(
        fishType.size.height * 0.5,
        fishType.size.length * 0.4,
        8
    );
    // Lighter version of the fish color for the head
    const headColor = new THREE.Color(fishType.color);
    headColor.r = Math.min(1, headColor.r * 1.3);
    headColor.g = Math.min(1, headColor.g * 1.3);
    headColor.b = Math.min(1, headColor.b * 1.3);
    
    const headMaterial = new THREE.MeshBasicMaterial({ color: headColor });
    const fishHead = new THREE.Mesh(headGeometry, headMaterial);
    fishHead.position.x = fishType.size.length * 0.5; // Position at front of body
    fishHead.rotation.z = -Math.PI / 2; // Rotate to point forward
    fishGroup.add(fishHead);
    
    // Create the fish tail connector - wider and flatter
    const tailGeometry = new THREE.BoxGeometry(
        fishType.size.length * 0.2,
        fishType.size.height * 0.8,
        fishType.size.width * 0.1
    );
    // Slightly darker version of the fish color for the tail
    const tailColor = new THREE.Color(fishType.color);
    tailColor.r = Math.max(0, tailColor.r * 0.9);
    tailColor.g = Math.max(0, tailColor.g * 0.9);
    tailColor.b = Math.max(0, tailColor.b * 0.9);
    
    const tailMaterial = new THREE.MeshBasicMaterial({ color: tailColor });
    const fishTail = new THREE.Mesh(tailGeometry, tailMaterial);
    fishTail.position.x = -fishType.size.length * 0.4; // Position at back of body
    fishGroup.add(fishTail);
    
    // Create tail fin - more like the image with a larger triangular shape
    const tailFinGeometry = new THREE.BufferGeometry();
    const tailFinVertices = new Float32Array([
        // Triangle shape resembling the reference image
        -fishType.size.length * 0.5, 0, 0,
        -fishType.size.length * 0.8, fishType.size.height * 0.5, 0,
        -fishType.size.length * 0.8, -fishType.size.height * 0.5, 0,
    ]);
    tailFinGeometry.setAttribute('position', new THREE.BufferAttribute(tailFinVertices, 3));
    const tailFinMaterial = new THREE.MeshBasicMaterial({ color: fishType.color, side: THREE.DoubleSide });
    const tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial);
    fishGroup.add(tailFin);
    
    // Add top fin - more pronounced
    const topFinGeometry = new THREE.BufferGeometry();
    const topFinVertices = new Float32Array([
        // Triangle 1 - matches the dorsal fin in the image
        0, fishType.size.height * 0.5, 0,
        fishType.size.length * 0.2, fishType.size.height * 0.9, 0,
        -fishType.size.length * 0.2, fishType.size.height * 0.9, 0,
    ]);
    topFinGeometry.setAttribute('position', new THREE.BufferAttribute(topFinVertices, 3));
    const topFinMaterial = new THREE.MeshBasicMaterial({ color: fishType.color, side: THREE.DoubleSide });
    const topFin = new THREE.Mesh(topFinGeometry, topFinMaterial);
    fishGroup.add(topFin);
    
    // Add side fins (pectoral fins) - small triangular shapes on both sides
    const sideFin1Geometry = new THREE.BufferGeometry();
    const sideFin1Vertices = new Float32Array([
        // Left side fin
        fishType.size.length * 0.2, 0, fishType.size.width * 0.5,
        fishType.size.length * 0.1, -fishType.size.height * 0.3, fishType.size.width * 0.7,
        fishType.size.length * 0.3, -fishType.size.height * 0.3, fishType.size.width * 0.7,
    ]);
    sideFin1Geometry.setAttribute('position', new THREE.BufferAttribute(sideFin1Vertices, 3));
    const sideFin1Material = new THREE.MeshBasicMaterial({ color: fishType.color, side: THREE.DoubleSide });
    const sideFin1 = new THREE.Mesh(sideFin1Geometry, sideFin1Material);
    fishGroup.add(sideFin1);
    
    // Mirror for the right side fin
    const sideFin2Geometry = new THREE.BufferGeometry();
    const sideFin2Vertices = new Float32Array([
        // Right side fin
        fishType.size.length * 0.2, 0, -fishType.size.width * 0.5,
        fishType.size.length * 0.1, -fishType.size.height * 0.3, -fishType.size.width * 0.7,
        fishType.size.length * 0.3, -fishType.size.height * 0.3, -fishType.size.width * 0.7,
    ]);
    sideFin2Geometry.setAttribute('position', new THREE.BufferAttribute(sideFin2Vertices, 3));
    const sideFin2Material = new THREE.MeshBasicMaterial({ color: fishType.color, side: THREE.DoubleSide });
    const sideFin2 = new THREE.Mesh(sideFin2Geometry, sideFin2Material);
    fishGroup.add(sideFin2);
    
    return fishGroup;
}

// Function to get a random fish type based on spawn chance
function getRandomFishType() {
    const rand = Math.random();
    let cumulativeChance = 0;
    
    for (const fishType of FishTypes) {
        cumulativeChance += fishType.spawnChance;
        if (rand < cumulativeChance) {
            return fishType;
        }
    }
    
    // Default to common fish if nothing else was selected
    return FishTypes[0];
}

export { FishTypes, createFishMesh, getRandomFishType }; 