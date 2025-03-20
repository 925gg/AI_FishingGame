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
    // Create the fish body
    const bodyGeometry = new THREE.BoxGeometry(
        fishType.size.length,
        fishType.size.height,
        fishType.size.width
    );
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: fishType.color });
    const fishBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // Create the fish tail
    const tailGeometry = new THREE.ConeGeometry(
        fishType.size.height / 2,
        fishType.size.length / 2,
        4
    );
    const tailMaterial = new THREE.MeshBasicMaterial({ color: fishType.color });
    const fishTail = new THREE.Mesh(tailGeometry, tailMaterial);
    
    // Position the tail at the back of the body
    fishTail.position.x = -fishType.size.length / 2 - fishType.size.length / 4; 
    fishTail.rotation.z = Math.PI / 2;
    
    // Create a group to hold the fish parts
    const fishGroup = new THREE.Group();
    fishGroup.add(fishBody);
    fishGroup.add(fishTail);
    
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