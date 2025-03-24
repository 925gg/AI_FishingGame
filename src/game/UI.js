import * as THREE from 'three';

class UI {
    constructor(gameState) {
        this.gameState = gameState;
        this.audioManager = gameState.audioManager; // Assuming AudioManager instance is available in gameState
        
        this.container = null;
        this.scoreElement = null;
        this.timerElement = null;
        this.startButton = null;
        this.messageElement = null;
        this.fishInfoElement = null;
        this.leaderboardElement = null;
        this.nameInputContainer = null;
        this.nameInput = null;
        this.saveButton = null;
        this.streakElement = null; // New element for streak display
        
        // Create UI elements
        this.initUI();
        this.updateLeaderboard();
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
        
        // Leaderboard
        this.leaderboardElement = document.createElement('div');
        this.leaderboardElement.style.marginBottom = '20px';
        this.leaderboardElement.style.maxHeight = '200px';
        this.leaderboardElement.style.overflowY = 'auto';
        this.leaderboardElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        this.leaderboardElement.style.borderRadius = '5px';
        this.leaderboardElement.style.padding = '10px';
        this.container.appendChild(this.leaderboardElement);

        // Name input container
        this.nameInputContainer = document.createElement('div');
        this.nameInputContainer.style.display = 'none';
        this.nameInputContainer.style.marginBottom = '15px';
        this.nameInputContainer.style.textAlign = 'center';
        
        const nameInputTitle = document.createElement('p');
        nameInputTitle.style.margin = '0 0 10px 0';
        nameInputTitle.style.fontSize = '18px';
        nameInputTitle.textContent = 'New High Score! Enter your name:';
        this.nameInputContainer.appendChild(nameInputTitle);
        
        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.maxLength = 20;
        this.nameInput.style.padding = '8px';
        this.nameInput.style.fontSize = '16px';
        this.nameInput.style.border = 'none';
        this.nameInput.style.borderRadius = '4px';
        this.nameInput.style.background = 'rgba(255, 255, 255, 0.9)';
        this.nameInput.style.width = '200px';
        this.nameInput.style.marginRight = '8px';
        this.nameInputContainer.appendChild(this.nameInput);
        
        this.saveButton = document.createElement('button');
        this.saveButton.textContent = 'Save';
        this.saveButton.style.padding = '8px 16px';
        this.saveButton.style.fontSize = '16px';
        this.saveButton.style.border = 'none';
        this.saveButton.style.borderRadius = '4px';
        this.saveButton.style.background = '#4CAF50';
        this.saveButton.style.color = 'white';
        this.saveButton.style.cursor = 'pointer';
        this.nameInputContainer.appendChild(this.saveButton);
        
        // Set up event listeners
        const handleSave = () => {
            const name = this.nameInput.value.trim() || 'Anonymous';
            this.gameState.saveScore(name);
            this.nameInputContainer.style.display = 'none';
            this.updateLeaderboard();
            this.nameInput.value = ''; // Clear input for next time
        };
        
        this.saveButton.onclick = handleSave;
        this.nameInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleSave();
        };
        
        this.container.appendChild(this.nameInputContainer);
        
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
        this.startButton.style.borderRadius = '5px';
        this.startButton.style.cursor = 'pointer';
        this.startButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        this.startButton.addEventListener('click', () => {
            // Resume audio context when game starts
            this.audioManager.resumeAudioContext();
            
            if (this.gameState.isGameActive) return;
            
            this.gameState.startGame();
            this.startButton.style.display = 'none';
            this.messageElement.textContent = 'Click to cast your line!';
            
            // Start the countdown
            this.showCountdown(3, () => {
                this.updateTimer();
                this.timerInterval = setInterval(() => this.updateTimer(), 1000);
            });
        });
        
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
            <p>⌨️ When a fish bites, hit SPACE when the marker is in the green zone!</p>
            <p>💫 Harder fish require more precise timing and multiple hits</p>
            <p>⭐ Perfect catches in the center give bonus points!</p>
        `;
        this.container.appendChild(instructions);

        // Add music controls
        const musicControls = document.createElement('div');
        musicControls.style.position = 'absolute';
        musicControls.style.top = '15px';
        musicControls.style.right = '15px';
        musicControls.style.padding = '10px';
        musicControls.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        musicControls.style.borderRadius = '10px';
        musicControls.style.display = 'flex';
        musicControls.style.alignItems = 'center';
        musicControls.style.gap = '10px';
        musicControls.style.backdropFilter = 'blur(4px)';

        // Music toggle button
        const musicButton = document.createElement('button');
        musicButton.innerHTML = '🎵';
        musicButton.style.padding = '8px';
        musicButton.style.fontSize = '20px';
        musicButton.style.backgroundColor = '#4CAF50';
        musicButton.style.color = 'white';
        musicButton.style.border = 'none';
        musicButton.style.borderRadius = '5px';
        musicButton.style.cursor = 'pointer';
        musicButton.style.width = '40px';
        musicButton.style.height = '40px';
        musicButton.style.display = 'flex';
        musicButton.style.alignItems = 'center';
        musicButton.style.justifyContent = 'center';
        musicButton.title = 'Toggle Background Music';

        // Volume slider
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '100';
        volumeSlider.value = '80'; // Updated from 10 to 80 (80%)
        volumeSlider.style.width = '100px';
        volumeSlider.title = 'Music Volume';

        // Event listeners
        musicButton.addEventListener('click', () => {
            // Resume audio context first
            this.audioManager.resumeAudioContext();
            const isPlaying = this.audioManager.toggleMusic();
            musicButton.style.backgroundColor = isPlaying ? '#4CAF50' : '#F44336';
        });

        volumeSlider.addEventListener('input', (e) => {
            // Resume audio context first
            this.audioManager.resumeAudioContext();
            this.audioManager.setMusicVolume(e.target.value / 100);
        });

        musicControls.appendChild(musicButton);
        musicControls.appendChild(volumeSlider);
        document.body.appendChild(musicControls);

        // Create streak element
        this.streakElement = document.createElement('div');
        this.streakElement.style.position = 'absolute';
        this.streakElement.style.top = '70px';
        this.streakElement.style.right = '20px';
        this.streakElement.style.color = 'white';
        this.streakElement.style.fontSize = '18px';
        this.streakElement.style.fontWeight = 'bold';
        this.streakElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        this.streakElement.style.padding = '8px 15px';
        this.streakElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.streakElement.style.borderRadius = '5px';
        this.streakElement.style.display = 'none';
        document.body.appendChild(this.streakElement);
    }
    
    updateLeaderboard() {
        const scores = this.gameState.getTopScores();
        this.leaderboardElement.innerHTML = '<h3 style="margin: 0 0 10px 0; text-align: center;">🏆 Top Scores 🏆</h3>';
        
        if (scores.length === 0) {
            this.leaderboardElement.innerHTML += '<p style="text-align: center; opacity: 0.8;">No scores yet. Be the first!</p>';
            return;
        }

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '14px';

        scores.forEach((score, index) => {
            const row = table.insertRow();
            row.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            
            // Rank cell
            const rankCell = row.insertCell();
            rankCell.textContent = `${index + 1}.`;
            rankCell.style.padding = '4px';
            rankCell.style.width = '30px';
            
            // Name cell
            const nameCell = row.insertCell();
            nameCell.textContent = score.name;
            nameCell.style.padding = '4px';
            
            // Score cell
            const scoreCell = row.insertCell();
            scoreCell.textContent = score.score;
            scoreCell.style.padding = '4px';
            scoreCell.style.textAlign = 'right';
            scoreCell.style.fontWeight = 'bold';
            
            // Date cell
            const dateCell = row.insertCell();
            dateCell.textContent = score.date;
            dateCell.style.padding = '4px';
            dateCell.style.fontSize = '12px';
            dateCell.style.opacity = '0.8';
            dateCell.style.textAlign = 'right';
        });

        this.leaderboardElement.appendChild(table);
    }

    update() {
        if (this.gameState.isGameActive) {
            // Update score display
            this.scoreElement.textContent = `Score: ${this.gameState.score}`;
            
            // Update timer display - format as MM:SS
            const minutes = Math.floor(this.gameState.timeRemaining / 60);
            const seconds = Math.floor(this.gameState.timeRemaining % 60);
            this.timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            // Show/hide UI elements
            this.startButton.style.display = 'none';
            this.messageElement.textContent = this.gameState.isFishing ? 'Waiting for a bite...' : 'Click on water to cast your line!';
            
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
                    case 'mystery':
                        this.fishInfoElement.style.backgroundColor = 'rgba(0, 255, 255, 0.7)';
                        break;
                    default:
                        this.fishInfoElement.style.backgroundColor = 'rgba(65, 105, 225, 0.6)';
                }
            } else {
                this.fishInfoElement.style.display = 'none';
            }
            
            // Handle name input visibility
            this.nameInputContainer.style.display = 'none';
            
            // Update streak display
            if (this.gameState.streakCount > 1) {
                this.streakElement.textContent = `Streak: ${this.gameState.streakCount} (×${this.gameState.scoreMultiplier.toFixed(1)})`;
                this.streakElement.style.display = 'block';
                this.streakElement.style.color = '#FFD700'; // Gold color for active streak
            } else {
                this.streakElement.style.display = 'none';
            }
        } else if (this.gameState.isEnteringName) {
            // Show name input screen
            this.nameInputContainer.style.display = 'block';
            this.nameInput.focus();
            this.startButton.style.display = 'none';
            
            // Hide streak display
            this.streakElement.style.display = 'none';
        } else {
            // Game over or start screen
            this.startButton.style.display = 'block';
            
            // Update message based on game state
            if (this.gameState.score > 0) {
                this.messageElement.textContent = `Game Over! Final Score: ${this.gameState.score}`;
                this.messageElement.style.backgroundColor = 'rgba(220, 20, 60, 0.7)';
                this.messageElement.style.fontWeight = 'bold';
            } else {
                this.messageElement.textContent = 'Press Start to begin!';
                this.messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            }
            
            // Hide streak display when game is not active
            this.streakElement.style.display = 'none';
            
            // Update leaderboard
            this.updateLeaderboard();
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