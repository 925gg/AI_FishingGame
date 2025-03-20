import * as THREE from 'three';

class Fishing {
  constructor(scene, camera, rod, waterLevel = -2) {
    this.scene = scene;
    this.camera = camera;
    this.rod = rod;
    this.waterLevel = waterLevel;
    
    this.isCasting = false;
    this.lineLength = 0;
    this.maxLineLength = 30;
    this.reelSpeed = 0.2;
    this.castPoint = null;
    
    // Fishing line (a line from the rod to the water)
    this.line = null;
    this.lineGeometry = new THREE.BufferGeometry();
    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
    
    // Bobber (shows where the line hits the water)
    this.bobber = null;
    this.bobberGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    this.bobberMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    
    this.createLine();
    this.setupEventListeners();
  }
  
  createLine() {
    // Create initial line (not visible until casting)
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ];
    
    this.lineGeometry.setFromPoints(points);
    this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
    this.scene.add(this.line);
    
    // Create bobber (not visible until casting)
    this.bobber = new THREE.Mesh(this.bobberGeometry, this.bobberMaterial);
    this.bobber.visible = false;
    this.scene.add(this.bobber);
  }
  
  setupEventListeners() {
    // Mouse down to cast
    document.addEventListener('mousedown', (event) => {
      if (event.button === 0 && !this.isCasting) { // Left click
        this.cast();
      }
    });
    
    // Mouse up to reel in
    document.addEventListener('mouseup', (event) => {
      if (event.button === 0 && this.isCasting) { // Left click
        this.startReeling();
      }
    });
  }
  
  cast() {
    this.isCasting = true;
    
    // Get rod tip position (end of the rod)
    const rodTipPosition = new THREE.Vector3();
    this.rod.getWorldPosition(rodTipPosition);
    rodTipPosition.y -= 0.75; // Adjust to rod tip
    
    // Cast direction is where the camera is facing
    const castDirection = new THREE.Vector3();
    this.camera.getWorldDirection(castDirection);
    
    // Calculate where the line will hit the water
    const t = (this.waterLevel - rodTipPosition.y) / castDirection.y;
    this.castPoint = new THREE.Vector3(
      rodTipPosition.x + castDirection.x * t,
      this.waterLevel,
      rodTipPosition.z + castDirection.z * t
    );
    
    // Make sure the cast point is within bounds
    const maxDistance = 40;
    const distanceFromOrigin = Math.sqrt(
      this.castPoint.x * this.castPoint.x + this.castPoint.z * this.castPoint.z
    );
    
    if (distanceFromOrigin > maxDistance) {
      const scale = maxDistance / distanceFromOrigin;
      this.castPoint.x *= scale;
      this.castPoint.z *= scale;
    }
    
    // Position the bobber at the cast point
    this.bobber.position.copy(this.castPoint);
    this.bobber.visible = true;
    
    // Update line
    this.updateLine(rodTipPosition);
  }
  
  startReeling() {
    // Start reeling in
    this.isCasting = false;
    
    // Hide bobber
    this.bobber.visible = false;
    
    // Reset line
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ];
    this.lineGeometry.setFromPoints(points);
    this.line.geometry.attributes.position.needsUpdate = true;
    
    return this.castPoint;
  }
  
  updateLine(rodTipPosition) {
    if (!this.isCasting || !this.castPoint) return;
    
    // Update line geometry
    const points = [
      rodTipPosition,
      this.castPoint
    ];
    
    this.lineGeometry.setFromPoints(points);
    this.line.geometry.attributes.position.needsUpdate = true;
  }
  
  update() {
    if (!this.rod) return;
    
    // Get current rod tip position
    const rodTipPosition = new THREE.Vector3();
    this.rod.getWorldPosition(rodTipPosition);
    rodTipPosition.y -= 0.75; // Adjust to rod tip
    
    // Update line position
    this.updateLine(rodTipPosition);
    
    // Make bobber float slightly
    if (this.bobber.visible) {
      this.bobber.position.y = this.waterLevel + Math.sin(Date.now() * 0.005) * 0.05;
    }
  }
  
  getCastPosition() {
    return this.castPoint ? this.castPoint.clone() : null;
  }
}

export default Fishing; 