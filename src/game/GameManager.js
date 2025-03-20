import { createRandomFish } from './Fish.js';

class GameManager {
  constructor(scene, waterLevel = -2) {
    this.scene = scene;
    this.waterLevel = waterLevel;
    this.score = 0;
    this.gameTime = 60; // Game duration in seconds
    this.timeRemaining = this.gameTime;
    this.isGameActive = false;
    this.fishes = [];
    this.maxFish = 15;
    this.fishSpawnInterval = null;
    this.timerInterval = null;
    
    // DOM elements for UI
    this.scoreElement = null;
    this.timerElement = null;
    this.messageElement = null;
    
    this.createUI();
  }
  
  createUI() {
    // Create score display
    this.scoreElement = document.createElement('div');
    this.scoreElement.id = 'score';
    this.scoreElement.style.position = 'absolute';
    this.scoreElement.style.top = '20px';
    this.scoreElement.style.left = '20px';
    this.scoreElement.style.color = 'white';
    this.scoreElement.style.fontSize = '24px';
    this.scoreElement.style.fontFamily = 'Arial, sans-serif';
    this.scoreElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    this.scoreElement.innerHTML = 'Score: 0';
    document.body.appendChild(this.scoreElement);
    
    // Create timer display
    this.timerElement = document.createElement('div');
    this.timerElement.id = 'timer';
    this.timerElement.style.position = 'absolute';
    this.timerElement.style.top = '20px';
    this.timerElement.style.right = '20px';
    this.timerElement.style.color = 'white';
    this.timerElement.style.fontSize = '24px';
    this.timerElement.style.fontFamily = 'Arial, sans-serif';
    this.timerElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    this.timerElement.innerHTML = 'Time: 60s';
    document.body.appendChild(this.timerElement);
    
    // Create message display (for start/end game)
    this.messageElement = document.createElement('div');
    this.messageElement.id = 'message';
    this.messageElement.style.position = 'absolute';
    this.messageElement.style.top = '50%';
    this.messageElement.style.left = '50%';
    this.messageElement.style.transform = 'translate(-50%, -50%)';
    this.messageElement.style.color = 'white';
    this.messageElement.style.fontSize = '32px';
    this.messageElement.style.fontFamily = 'Arial, sans-serif';
    this.messageElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    this.messageElement.style.textAlign = 'center';
    this.messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.messageElement.style.padding = '20px';
    this.messageElement.style.borderRadius = '10px';
    this.messageElement.innerHTML = 'Click to Start Fishing!';
    document.body.appendChild(this.messageElement);
    
    // Add click event to start game
    document.addEventListener('click', () => {
      if (!this.isGameActive) {
        this.startGame();
      }
    });
  }
  
  startGame() {
    if (this.isGameActive) return;
    
    this.isGameActive = true;
    this.score = 0;
    this.timeRemaining = this.gameTime;
    this.updateScore(0);
    this.updateTimer();
    this.messageElement.style.display = 'none';
    
    // Clear any existing fish
    this.clearAllFish();
    
    // Start spawning fish
    this.fishSpawnInterval = setInterval(() => this.spawnFish(), 1000);
    
    // Start the timer
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimer();
      
      if (this.timeRemaining <= 0) {
        this.endGame();
      }
    }, 1000);
  }
  
  endGame() {
    this.isGameActive = false;
    
    // Stop intervals
    clearInterval(this.fishSpawnInterval);
    clearInterval(this.timerInterval);
    
    // Display game over message
    this.messageElement.innerHTML = `
      Game Over!<br>
      Final Score: ${this.score}<br>
      Click to Play Again
    `;
    this.messageElement.style.display = 'block';
  }
  
  spawnFish() {
    if (!this.isGameActive) return;
    
    // Check if we've reached max fish
    if (this.fishes.length >= this.maxFish) {
      // Remove random fish if at capacity
      const indexToRemove = Math.floor(Math.random() * this.fishes.length);
      this.fishes[indexToRemove].remove();
      this.fishes.splice(indexToRemove, 1);
    }
    
    // Add new fish
    const newFish = createRandomFish(this.scene, this.waterLevel);
    this.fishes.push(newFish);
  }
  
  updateFish() {
    for (let i = 0; i < this.fishes.length; i++) {
      this.fishes[i].update();
    }
  }
  
  catchFish(position, catchRadius = 3) {
    if (!this.isGameActive) return null;
    
    let closestFish = null;
    let closestDistance = catchRadius;
    
    for (let i = 0; i < this.fishes.length; i++) {
      const fish = this.fishes[i];
      if (fish.caught) continue;
      
      const distance = Math.sqrt(
        Math.pow(fish.position.x - position.x, 2) +
        Math.pow(fish.position.z - position.z, 2)
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestFish = fish;
      }
    }
    
    if (closestFish) {
      closestFish.catch();
      this.updateScore(closestFish.points);
      
      // Remove fish from array
      const index = this.fishes.indexOf(closestFish);
      if (index !== -1) {
        this.fishes.splice(index, 1);
      }
      
      return closestFish;
    }
    
    return null;
  }
  
  updateScore(points) {
    this.score += points;
    this.scoreElement.innerHTML = `Score: ${this.score}`;
  }
  
  updateTimer() {
    this.timerElement.innerHTML = `Time: ${this.timeRemaining}s`;
    
    // Change color when time is running out
    if (this.timeRemaining <= 10) {
      this.timerElement.style.color = 'red';
    } else {
      this.timerElement.style.color = 'white';
    }
  }
  
  clearAllFish() {
    // Remove all fish from the scene
    for (let i = 0; i < this.fishes.length; i++) {
      this.fishes[i].remove();
    }
    this.fishes = [];
  }
}

export default GameManager; 