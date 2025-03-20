import * as THREE from 'three';

// Base Fish class
class Fish {
  constructor(scene, waterLevel = -2) {
    this.scene = scene;
    this.waterLevel = waterLevel;
    this.mesh = null;
    this.speed = 0.02;
    this.caught = false;
    this.points = 10;
    this.name = "Generic Fish";
    this.color = 0xCCCCCC;
    this.size = { x: 0.4, y: 0.2, z: 0.8 };
    
    // Random position within bounds
    this.position = {
      x: (Math.random() - 0.5) * 30,
      y: this.waterLevel + Math.random() * 1.5,
      z: (Math.random() - 0.5) * 30
    };
    
    this.direction = Math.random() * Math.PI * 2;
    this.createMesh();
  }
  
  createMesh() {
    // Create fish body
    const geometry = new THREE.BoxGeometry(
      this.size.x, 
      this.size.y, 
      this.size.z
    );
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geometry, material);
    
    // Add tail fin
    const tailGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.05);
    const tailMesh = new THREE.Mesh(tailGeometry, material);
    tailMesh.position.set(0, 0, -this.size.z/2 - 0.025);
    this.mesh.add(tailMesh);
    
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.y = this.direction;
    this.scene.add(this.mesh);
  }
  
  update() {
    if (this.caught) return;
    
    // Move in current direction
    this.position.x += Math.sin(this.direction) * this.speed;
    this.position.z += Math.cos(this.direction) * this.speed;
    
    // Change direction occasionally
    if (Math.random() < 0.01) {
      this.direction += (Math.random() - 0.5) * Math.PI/4;
    }
    
    // Keep fish within bounds
    const bounds = 40;
    if (Math.abs(this.position.x) > bounds || Math.abs(this.position.z) > bounds) {
      this.direction += Math.PI;
    }
    
    // Update mesh position and rotation
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.y = this.direction;
  }
  
  catch() {
    if (this.caught) return false;
    
    this.caught = true;
    this.scene.remove(this.mesh);
    return true;
  }
  
  remove() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh = null;
    }
  }
}

// Different fish types
class SmallFish extends Fish {
  constructor(scene, waterLevel) {
    super(scene, waterLevel);
    this.points = 5;
    this.name = "Small Fish";
    this.color = 0x6495ED; // Cornflower blue
    this.size = { x: 0.3, y: 0.15, z: 0.6 };
    this.speed = 0.03;
    this.createMesh();
  }
}

class MediumFish extends Fish {
  constructor(scene, waterLevel) {
    super(scene, waterLevel);
    this.points = 10;
    this.name = "Medium Fish";
    this.color = 0xFFA500; // Orange
    this.size = { x: 0.4, y: 0.2, z: 0.8 };
    this.speed = 0.02;
    this.createMesh();
  }
}

class LargeFish extends Fish {
  constructor(scene, waterLevel) {
    super(scene, waterLevel);
    this.points = 20;
    this.name = "Large Fish";
    this.color = 0x9370DB; // Medium purple
    this.size = { x: 0.6, y: 0.3, z: 1.2 };
    this.speed = 0.015;
    this.createMesh();
  }
}

class RareFish extends Fish {
  constructor(scene, waterLevel) {
    super(scene, waterLevel);
    this.points = 50;
    this.name = "Rare Fish";
    this.color = 0xFFD700; // Gold
    this.size = { x: 0.5, y: 0.25, z: 1.0 };
    this.speed = 0.035;
    this.createMesh();
  }
}

// Factory to create random fish
function createRandomFish(scene, waterLevel) {
  const random = Math.random();
  
  if (random < 0.1) {
    return new RareFish(scene, waterLevel);
  } else if (random < 0.3) {
    return new LargeFish(scene, waterLevel);
  } else if (random < 0.6) {
    return new MediumFish(scene, waterLevel);
  } else {
    return new SmallFish(scene, waterLevel);
  }
}

export { Fish, SmallFish, MediumFish, LargeFish, RareFish, createRandomFish }; 