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
        this.container.style.top = '10px';
        this.container.style.left = '10px';
        this.container.style.padding = '10px';
        this.container.style.color = 'white';
        this.container.style.fontFamily = 'Arial, sans-serif';
        this.container.style.textShadow = '1px 1px 2px black';
        document.body.appendChild(this.container);
        
        // Score display
        this.scoreElement = document.createElement('div');
        this.scoreElement.style.fontSize = '24px';
        this.scoreElement.style.marginBottom = '10px';
        this.scoreElement.textContent = 'Score: 0';
        this.container.appendChild(this.scoreElement);
        
        // Timer display
        this.timerElement = document.createElement('div');
        this.timerElement.style.fontSize = '24px';
        this.timerElement.style.marginBottom = '10px';
        this.timerElement.textContent = 'Time: 60s';
        this.container.appendChild(this.timerElement);
        
        // Game message display
        this.messageElement = document.createElement('div');
        this.messageElement.style.fontSize = '20px';
        this.messageElement.style.marginBottom = '10px';
        this.messageElement.textContent = 'Press Start to begin!';
        this.container.appendChild(this.messageElement);
        
        // Fish info display (shows when catching a fish)
        this.fishInfoElement = document.createElement('div');
        this.fishInfoElement.style.fontSize = '18px';
        this.fishInfoElement.style.display = 'none';
        this.container.appendChild(this.fishInfoElement);
        
        // Start button
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Start Game';
        this.startButton.style.padding = '10px 20px';
        this.startButton.style.fontSize = '18px';
        this.startButton.style.backgroundColor = '#4CAF50';
        this.startButton.style.color = 'white';
        this.startButton.style.border = 'none';
        this.startButton.style.borderRadius = '4px';
        this.startButton.style.cursor = 'pointer';
        this.container.appendChild(this.startButton);
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.style.marginTop = '20px';
        instructions.style.fontSize = '16px';
        instructions.innerHTML = `
            <p>Click on water to cast your line</p>
            <p>Press SPACE when the bobber moves to catch a fish!</p>
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
        } else {
            this.fishInfoElement.style.display = 'none';
        }
        
        // Update message based on game state
        if (!this.gameState.isGameActive && this.gameState.score > 0) {
            this.messageElement.textContent = `Game Over! Final Score: ${this.gameState.score}`;
        } else if (this.gameState.isGameActive) {
            if (this.gameState.isFishing) {
                this.messageElement.textContent = 'Waiting for a bite...';
            } else {
                this.messageElement.textContent = 'Click on water to cast your line!';
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
        countdownElement.style.fontSize = '72px';
        countdownElement.style.color = 'white';
        countdownElement.style.textShadow = '2px 2px 4px black';
        document.body.appendChild(countdownElement);
        
        let count = seconds;
        const countdownInterval = setInterval(() => {
            countdownElement.textContent = count;
            
            if (count <= 0) {
                clearInterval(countdownInterval);
                document.body.removeChild(countdownElement);
                if (onComplete) onComplete();
            }
            
            count--;
        }, 1000);
    }
}

export default UI; 