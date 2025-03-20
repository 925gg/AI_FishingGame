import * as THREE from 'three';

export class WaterSystem {
    constructor(scene, waterMesh) {
        this.scene = scene;
        this.water = waterMesh;
        this.ripples = [];
        this.maxRipples = 5;
        
        // Create water shader material
        this.waterMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                ripples: { value: [] }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec4 ripples[5];
                varying vec2 vUv;
                
                void main() {
                    vec4 color = vec4(0.0, 0.47, 1.0, 0.8);
                    float displacement = 0.0;
                    
                    for(int i = 0; i < 5; i++) {
                        vec2 ripplePos = ripples[i].xy;
                        float rippleRadius = ripples[i].z;
                        float rippleStrength = ripples[i].w;
                        
                        float dist = distance(vUv, ripplePos);
                        if(dist < rippleRadius) {
                            float fade = 1.0 - (dist / rippleRadius);
                            displacement += rippleStrength * fade * sin(dist * 10.0 - time * 2.0);
                        }
                    }
                    
                    color.rgb += vec3(displacement * 0.1);
                    gl_FragColor = color;
                }
            `,
            transparent: true
        });
        
        this.water.material = this.waterMaterial;
    }

    addRipple(position, radius = 0.1, strength = 0.5) {
        // Convert world position to UV coordinates
        const worldToLocal = new THREE.Matrix4().getInverse(this.water.matrixWorld);
        const localPos = new THREE.Vector3().copy(position).applyMatrix4(worldToLocal);
        const uv = new THREE.Vector2(
            (localPos.x + 10) / 20,
            (localPos.z + 10) / 20
        );

        // Add new ripple
        this.ripples.push({
            position: uv,
            radius: radius,
            strength: strength,
            startTime: Date.now(),
            duration: 2000 // 2 seconds
        });

        // Remove old ripples if we exceed max
        if (this.ripples.length > this.maxRipples) {
            this.ripples.shift();
        }

        // Update shader uniforms
        this.updateRippleUniforms();
    }

    updateRippleUniforms() {
        const rippleData = new Float32Array(20); // 5 ripples * 4 components (x, y, radius, strength)
        
        for (let i = 0; i < this.ripples.length; i++) {
            const ripple = this.ripples[i];
            const elapsed = Date.now() - ripple.startTime;
            const progress = Math.min(elapsed / ripple.duration, 1);
            
            // Fade out ripple
            const currentStrength = ripple.strength * (1 - progress);
            
            rippleData[i * 4] = ripple.position.x;
            rippleData[i * 4 + 1] = ripple.position.y;
            rippleData[i * 4 + 2] = ripple.radius;
            rippleData[i * 4 + 3] = currentStrength;
        }

        // Fill remaining slots with zero ripples
        for (let i = this.ripples.length; i < this.maxRipples; i++) {
            rippleData[i * 4] = 0;
            rippleData[i * 4 + 1] = 0;
            rippleData[i * 4 + 2] = 0;
            rippleData[i * 4 + 3] = 0;
        }

        this.waterMaterial.uniforms.ripples.value = rippleData;
    }

    update() {
        // Update time uniform for wave animation
        this.waterMaterial.uniforms.time.value += 0.016; // Assuming 60fps

        // Remove expired ripples
        this.ripples = this.ripples.filter(ripple => {
            const elapsed = Date.now() - ripple.startTime;
            return elapsed < ripple.duration;
        });

        // Update ripple uniforms
        this.updateRippleUniforms();
    }
} 