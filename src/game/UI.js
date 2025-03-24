class UI {
    constructor(gameState) {
        this.gameState = gameState;
        
        this.container = null;
        this.scoreElement = null;
        this.timerElement = null;
        this.startButton = null;
        this.messageElement = null;
        this.fishInfoElement = null;
        
        // Create UI elements
        this.initUI();
    }
    
    initUI() {
        // Create container for UI elements
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '15px';
        this.container.style.left = '15px';
        this.container.style.padding = '15px';
        this.container.style.color = 'white';
        this.container.style.fontFamily = 'Arial, sans-serif';
        this.container.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.container.style.borderRadius = '10px';
        this.container.style.backdropFilter = 'blur(4px)';
        this.container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        this.container.style.minWidth = '250px';
        document.body.appendChild(this.container);
        
        // Score display
        this.scoreElement = document.createElement('div');
        this.scoreElement.style.fontSize = '28px';
        this.scoreElement.style.marginBottom = '12px';
        this.scoreElement.style.fontWeight = 'bold';
        this.scoreElement.textContent = 'Score: 0';
        this.container.appendChild(this.scoreElement);
        
        // Timer display
        this.timerElement = document.createElement('div');
        this.timerElement.style.fontSize = '28px';
        this.timerElement.style.marginBottom = '12px';
        this.timerElement.style.fontWeight = 'bold';
        this.timerElement.textContent = 'Time: 60s';
        this.container.appendChild(this.timerElement);
        
        // Game message display
        this.messageElement = document.createElement('div');
        this.messageElement.style.fontSize = '20px';
        this.messageElement.style.marginBottom = '15px';
        this.messageElement.style.padding = '8px';
        this.messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        this.messageElement.style.borderRadius = '5px';
        this.messageElement.style.textAlign = 'center';
        this.messageElement.textContent = 'Press Start to begin!';
        this.container.appendChild(this.messageElement);
        
        // Fish info display (shows when catching a fish)
        this.fishInfoElement = document.createElement('div');
        this.fishInfoElement.style.fontSize = '20px';
        this.fishInfoElement.style.display = 'none';
        this.fishInfoElement.style.marginBottom = '15px';
        this.fishInfoElement.style.padding = '10px';
        this.fishInfoElement.style.borderRadius = '5px';
        this.fishInfoElement.style.backgroundColor = 'rgba(65, 105, 225, 0.6)';
        this.fishInfoElement.style.textAlign = 'center';
        this.fishInfoElement.style.fontWeight = 'bold';
        this.container.appendChild(this.fishInfoElement);
        
        // Start button
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Start Game';
        this.startButton.style.padding = '12px 25px';
        this.startButton.style.fontSize = '20px';
        this.startButton.style.backgroundColor = '#4CAF50';
        this.startButton.style.color = 'white';
        this.startButton.style.border = 'none';
        this.startButton.style.borderRadius = '8px';
        this.startButton.style.cursor = 'pointer';
        this.startButton.style.width = '100%';
        this.startButton.style.fontWeight = 'bold';
        this.startButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
        this.startButton.style.transition = 'all 0.2s ease-in-out';
        
        // Add hover effect
        this.startButton.onmouseover = () => {
            this.startButton.style.backgroundColor = '#3e8e41';
            this.startButton.style.transform = 'scale(1.05)';
        };
        this.startButton.onmouseout = () => {
            this.startButton.style.backgroundColor = '#4CAF50';
            this.startButton.style.transform = 'scale(1)';
        };
        
        this.container.appendChild(this.startButton);
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.style.marginTop = '20px';
        instructions.style.fontSize = '16px';
        instructions.style.padding = '12px';
        instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        instructions.style.borderRadius = '5px';
        instructions.style.lineHeight = '1.5';
        instructions.innerHTML = `
            <p>🎣 Click on water to cast your line</p>
            <p>⌨️ Press SPACE when the bobber moves to catch a fish!</p>
        `;
        this.container.appendChild(instructions);
    }
    
    update() {
        // Update score display
        this.scoreElement.textContent = `Score: ${this.gameState.score}`;
        
        // Update timer display
        const timeInSeconds = Math.ceil(this.gameState.timeRemaining);
        this.timerElement.textContent = `Time: ${timeInSeconds}s`;
        
        // Show/hide start button based on game state
        this.startButton.style.display = this.gameState.isGameActive ? 'none' : 'block';
        
        // Update fish info if a fish is caught
        if (this.gameState.isFishing && this.gameState.caughtFish) {
            this.fishInfoElement.style.display = 'block';
            this.fishInfoElement.textContent = `Got a bite! ${this.gameState.caughtFish.name} (${this.gameState.caughtFish.points} pts)`;
            
            // Set background color based on fish rarity
            switch(this.gameState.caughtFish.id) {
                case 'common':
                    this.fishInfoElement.style.backgroundColor = 'rgba(123, 157, 183, 0.7)';
                    break;
                case 'rare':
                    this.fishInfoElement.style.backgroundColor = 'rgba(255, 215, 0, 0.7)';
                    break;
                case 'exotic':
                    this.fishInfoElement.style.backgroundColor = 'rgba(255, 99, 71, 0.7)';
                    break;
                case 'legendary':
                    this.fishInfoElement.style.backgroundColor = 'rgba(148, 0, 211, 0.7)';
                    break;
                default:
                    this.fishInfoElement.style.backgroundColor = 'rgba(65, 105, 225, 0.6)';
            }
        } else {
            this.fishInfoElement.style.display = 'none';
        }
        
        // Update message based on game state
        if (!this.gameState.isGameActive && this.gameState.score > 0) {
            this.messageElement.textContent = `Game Over! Final Score: ${this.gameState.score}`;
            this.messageElement.style.backgroundColor = 'rgba(220, 20, 60, 0.7)';
            this.messageElement.style.fontWeight = 'bold';
        } else if (this.gameState.isGameActive) {
            if (this.gameState.isFishing) {
                this.messageElement.textContent = 'Waiting for a bite...';
                this.messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            } else {
                this.messageElement.textContent = 'Click on water to cast your line!';
                this.messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            }
        }
    }
    
    getStartButton() {
        return this.startButton;
    }
    
    showCountdown(seconds, onComplete) {
        const countdownElement = document.createElement('div');
        countdownElement.style.position = 'absolute';
        countdownElement.style.top = '50%';
        countdownElement.style.left = '50%';
        countdownElement.style.transform = 'translate(-50%, -50%)';
        countdownElement.style.fontSize = '120px';
        countdownElement.style.color = 'white';
        countdownElement.style.textShadow = '3px 3px 8px rgba(0, 0, 0, 0.8)';
        countdownElement.style.fontWeight = 'bold';
        countdownElement.style.zIndex = '1000';
        countdownElement.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(countdownElement);
        
        // Add container with animation
        const countdownContainer = document.createElement('div');
        countdownContainer.style.position = 'absolute';
        countdownContainer.style.top = '0';
        countdownContainer.style.left = '0';
        countdownContainer.style.width = '100%';
        countdownContainer.style.height = '100%';
        countdownContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        countdownContainer.style.zIndex = '999';
        document.body.appendChild(countdownContainer);
        
        let count = seconds;
        const countdownInterval = setInterval(() => {
            countdownElement.textContent = count;
            
            // Add scale animation
            countdownElement.style.transition = 'transform 0.5s ease-out';
            countdownElement.style.transform = 'translate(-50%, -50%) scale(1.5)';
            setTimeout(() => {
                countdownElement.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 500);
            
            if (count <= 0) {
                clearInterval(countdownInterval);
                document.body.removeChild(countdownElement);
                document.body.removeChild(countdownContainer);
                if (onComplete) onComplete();
            }
            
            count--;
        }, 1000);
    }
}

export default UI; 