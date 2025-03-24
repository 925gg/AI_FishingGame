class SkillCheck {
    constructor() {
        this.container = null;
        this.marker = null;
        this.progressBar = null;
        this.catchZone = null;
        this.isActive = false;
        this.markerPosition = 0;
        this.direction = 1;
        this.speed = 0.5;
        this.catchZoneSize = 0.4;
        this.requiredHits = 1;
        this.currentHits = 0;
        this.onSuccess = null;
        this.onFail = null;
        
        this.createUI();
    }

    createUI() {
        // Create container
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.bottom = '100px';
        this.container.style.left = '50%';
        this.container.style.transform = 'translateX(-50%)';
        this.container.style.width = '300px';
        this.container.style.height = '40px';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.container.style.borderRadius = '20px';
        this.container.style.padding = '10px';
        this.container.style.display = 'none';

        // Create progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.style.width = '100%';
        this.progressBar.style.height = '20px';
        this.progressBar.style.backgroundColor = '#333';
        this.progressBar.style.borderRadius = '10px';
        this.progressBar.style.position = 'relative';
        this.progressBar.style.overflow = 'hidden';

        // Create catch zone
        this.catchZone = document.createElement('div');
        this.catchZone.style.position = 'absolute';
        this.catchZone.style.height = '100%';
        this.catchZone.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
        this.catchZone.style.left = '50%';
        this.catchZone.style.transform = 'translateX(-50%)';

        // Create marker
        this.marker = document.createElement('div');
        this.marker.style.position = 'absolute';
        this.marker.style.width = '4px';
        this.marker.style.height = '100%';
        this.marker.style.backgroundColor = 'white';
        this.marker.style.left = '0';

        // Assemble UI
        this.progressBar.appendChild(this.catchZone);
        this.progressBar.appendChild(this.marker);
        this.container.appendChild(this.progressBar);
        document.body.appendChild(this.container);
    }

    start(difficulty, onSuccess, onFail) {
        this.isActive = true;
        this.markerPosition = 0;
        this.direction = 1;
        this.currentHits = 0;
        this.onSuccess = onSuccess;
        this.onFail = onFail;

        // Set difficulty parameters
        this.speed = 0.8 - (difficulty * 0.1);
        this.catchZoneSize = Math.max(0.1, 0.5 - (difficulty * 0.1));
        this.requiredHits = Math.min(difficulty, 3);

        // Update catch zone size
        const zoneWidth = this.catchZoneSize * 100;
        this.catchZone.style.width = `${zoneWidth}%`;

        // Show UI
        this.container.style.display = 'block';

        // Start animation
        this.animate();
    }

    stop() {
        this.isActive = false;
        this.container.style.display = 'none';
    }

    animate() {
        if (!this.isActive) return;

        // Move marker
        this.markerPosition += this.direction * (this.speed / 60);
        
        // Bounce at edges
        if (this.markerPosition >= 1) {
            this.markerPosition = 1;
            this.direction = -1;
        } else if (this.markerPosition <= 0) {
            this.markerPosition = 0;
            this.direction = 1;
        }

        // Update marker position
        this.marker.style.left = `${this.markerPosition * 100}%`;

        requestAnimationFrame(() => this.animate());
    }

    checkHit() {
        if (!this.isActive) return false;

        // Calculate zones
        const center = 0.5;
        const halfZone = this.catchZoneSize / 2;
        const zoneStart = center - halfZone;
        const zoneEnd = center + halfZone;

        // Check if marker is in catch zone
        if (this.markerPosition >= zoneStart && this.markerPosition <= zoneEnd) {
            this.currentHits++;
            
            // Visual feedback
            this.progressBar.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                this.progressBar.style.backgroundColor = '#333';
            }, 100);

            // Check if enough hits
            if (this.currentHits >= this.requiredHits) {
                // Calculate score multiplier based on accuracy
                const distance = Math.abs(this.markerPosition - center);
                const perfectThreshold = 0.05;
                const scoreMultiplier = distance <= perfectThreshold ? 1 : 0.75;

                this.stop();
                this.onSuccess?.(scoreMultiplier);
            }
            return true;
        } else {
            // Visual feedback for miss
            this.progressBar.style.backgroundColor = '#F44336';
            setTimeout(() => {
                this.progressBar.style.backgroundColor = '#333';
            }, 100);

            this.stop();
            this.onFail?.();
            return false;
        }
    }
}

export default SkillCheck; 