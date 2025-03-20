import { Scene, PerspectiveCamera, WebGLRenderer, Vector3, AmbientLight, DirectionalLight, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CastingSystem } from '../systems/CastingSystem';
import { WaterSystem } from '../systems/WaterSystem';
import { FishBiteSystem } from '../systems/FishBiteSystem';
import { BoatSystem } from '../systems/BoatSystem';

export class GameScene {
    constructor() {
        this.scene = new Scene();
        this.scene.background = new Color(0x87CEEB); // Sky blue background

        // Setup camera
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Setup renderer
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Add lighting
        const ambientLight = new AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Initialize systems
        this.castingSystem = new CastingSystem();
        this.waterSystem = new WaterSystem();
        this.fishBiteSystem = new FishBiteSystem();
        this.boatSystem = new BoatSystem();

        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 30;

        // Add systems to scene
        this.scene.add(this.castingSystem.getBobber());
        this.scene.add(this.waterSystem.getWaterMesh());
        this.scene.add(this.boatSystem.getBoat());

        // Event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        // Game state
        this.isCasting = false;
        this.isReeling = false;
        this.lastTime = 0;
    }

    update(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update boat system
        this.boatSystem.update(deltaTime);

        // Update camera position to follow boat in driving mode
        if (this.boatSystem.isDrivingMode()) {
            const boatPosition = this.boatSystem.getPosition();
            const boatRotation = this.boatSystem.getRotation();
            
            // Position camera behind and above the boat
            const cameraOffset = new Vector3(-Math.sin(boatRotation.y) * 10, 5, -Math.cos(boatRotation.y) * 10);
            this.camera.position.copy(boatPosition).add(cameraOffset);
            this.camera.lookAt(boatPosition);
            
            // Disable orbit controls while driving
            this.controls.enabled = false;
        } else {
            // Enable orbit controls in fishing mode
            this.controls.enabled = true;
        }

        // Update fishing systems only when not in driving mode
        if (!this.boatSystem.isDrivingMode()) {
            // Update casting system with boat position
            const boatPosition = this.boatSystem.getPosition();
            this.castingSystem.setStartPosition(boatPosition);
            
            this.castingSystem.update(deltaTime);
            this.waterSystem.update(deltaTime);

            // Check for fish bite
            const bobberPosition = this.castingSystem.getBobberPosition();
            const waterLevel = this.waterSystem.getWaterLevel();
            
            if (this.fishBiteSystem.detectBite(bobberPosition, waterLevel)) {
                console.log('Fish is biting! Press R to reel in!');
            }

            // Update fish bite state
            const isStillBiting = this.fishBiteSystem.update(deltaTime);
            if (!isStillBiting && this.fishBiteSystem.getState().isFishBiting) {
                console.log('Fish got away!');
            }

            // Update mini-game if active
            if (this.fishBiteSystem.getState().miniGameActive) {
                const miniGameComplete = this.fishBiteSystem.updateMiniGame(deltaTime, this.isReeling);
                if (miniGameComplete) {
                    const state = this.fishBiteSystem.getState();
                    if (state.miniGameSuccess) {
                        console.log(`Caught a ${state.currentFish.type}!`);
                        console.log(`Weight: ${state.currentFish.weight}kg`);
                        console.log(`Value: ${state.currentFish.value} coins`);
                    } else {
                        console.log('Fish got away!');
                    }
                }
            }
        }

        // Update controls
        this.controls.update();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    onKeyDown(event) {
        // Handle boat controls
        this.boatSystem.handleKeyDown(event);

        // Handle fishing controls only when not in driving mode
        if (!this.boatSystem.isDrivingMode()) {
            switch (event.code) {
                case 'Space':
                    if (!this.isCasting) {
                        this.isCasting = true;
                        this.castingSystem.startCast();
                    }
                    break;
                case 'KeyR':
                    if (this.fishBiteSystem.getState().isFishBiting) {
                        this.isReeling = true;
                        if (!this.fishBiteSystem.getState().miniGameActive) {
                            this.fishBiteSystem.startMiniGame();
                        }
                    }
                    break;
            }
        }
    }

    onKeyUp(event) {
        // Handle boat controls
        this.boatSystem.handleKeyUp(event);

        // Handle fishing controls only when not in driving mode
        if (!this.boatSystem.isDrivingMode()) {
            switch (event.code) {
                case 'Space':
                    this.isCasting = false;
                    break;
                case 'KeyR':
                    this.isReeling = false;
                    break;
            }
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
} 