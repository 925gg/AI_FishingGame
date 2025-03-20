import * as THREE from 'three';

export class CastingSystem {
    constructor(scene) {
        this.scene = scene;
        this.bobber = null;
        this.line = null;
        this.isDragging = false;
        this.dragStart = new THREE.Vector2();
        this.dragEnd = new THREE.Vector2();
        this.trajectoryLine = null;
        this.maxCastPower = 20;
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Create bobber
        const bobberGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const bobberMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.bobber = new THREE.Mesh(bobberGeometry, bobberMaterial);
        this.bobber.castShadow = true;
        this.scene.add(this.bobber);

        // Create fishing line (invisible)
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
        this.line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(this.line);

        // Create trajectory line
        const trajectoryGeometry = new THREE.BufferGeometry();
        const trajectoryMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        this.trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
        this.scene.add(this.trajectoryLine);

        // Set initial position
        this.bobber.position.set(0, 0.1, 0);
        this.updateLine();
    }

    setupEventListeners() {
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.dragStart.set(event.clientX, event.clientY);
        this.dragEnd.copy(this.dragStart);
        this.updateTrajectory();
    }

    onMouseMove(event) {
        if (!this.isDragging) return;
        this.dragEnd.set(event.clientX, event.clientY);
        this.updateTrajectory();
    }

    onMouseUp(event) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.cast();
    }

    updateTrajectory() {
        const dragVector = this.dragEnd.clone().sub(this.dragStart);
        const power = Math.min(dragVector.length() / 100, 1) * this.maxCastPower;
        
        // Calculate trajectory points
        const points = [];
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = t * power;
            const y = -9.8 * t * t / 2 + power * t;
            points.push(new THREE.Vector3(x, y, 0));
        }

        // Update trajectory line
        this.trajectoryLine.geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flatMap(p => [p.x, p.y, p.z]), 3));
    }

    cast() {
        const dragVector = this.dragEnd.clone().sub(this.dragStart);
        const power = Math.min(dragVector.length() / 100, 1) * this.maxCastPower;
        
        // Animate bobber along trajectory
        const duration = 1000; // 1 second
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            
            // Quadratic motion
            const x = t * power;
            const y = -9.8 * t * t / 2 + power * t;
            
            this.bobber.position.set(x, y, 0);
            this.updateLine();
            
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                // Bobber landed
                this.bobber.position.y = 0.1;
                this.updateLine();
            }
        };
        
        animate();
    }

    updateLine() {
        // Update fishing line from bobber to origin
        const points = [
            new THREE.Vector3(0, 0, 0),
            this.bobber.position.clone()
        ];
        
        this.line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flatMap(p => [p.x, p.y, p.z]), 3));
    }
} 