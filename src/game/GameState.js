import AudioManager from './AudioManager.js';

class GameState {
    constructor() {
        this.score = 0;
        this.timeRemaining = 60; // 60 seconds game time
        this.isGameActive = false;
        this.isFishing = false;
        this.catchProgress = 0;
        this.caughtFish = null;
        this.leaderboard = this.loadLeaderboard();
        this.isEnteringName = false;
        this.audioManager = new AudioManager(); // Initialize AudioManager
        
        // Start background music
        // Note: Modern browsers require user interaction before playing audio
        // We'll start it here, and it will begin playing as soon as the user interacts
        this.audioManager.startBackgroundMusic();
    }

    loadLeaderboard() {
        const saved = localStorage.getItem('fishingGameLeaderboard');
        return saved ? JSON.parse(saved) : [];
    }

    saveScore(playerName) {
        const entry = {
            name: playerName,
            score: this.score,
            date: new Date().toLocaleDateString()
        };
        
        this.leaderboard.push(entry);
        // Sort by score in descending order
        this.leaderboard.sort((a, b) => b.score - a.score);
        // Keep only top 20 scores
        if (this.leaderboard.length > 20) {
            this.leaderboard = this.leaderboard.slice(0, 20);
        }
        
        localStorage.setItem('fishingGameLeaderboard', JSON.stringify(this.leaderboard));
        this.isEnteringName = false;
        return true;
    }

    isHighScore(score) {
        return this.leaderboard.length < 20 || score > this.leaderboard[this.leaderboard.length - 1].score;
    }

    getTopScores() {
        return this.leaderboard;
    }

    startGame() {
        this.score = 0;
        this.timeRemaining = 60;
        this.isGameActive = true;
        this.isFishing = false;
        this.catchProgress = 0;
        this.caughtFish = null;
    }

    endGame() {
        this.isGameActive = false;
        this.stopFishing(); // Ensure fishing is stopped and rod is reset
        if (this.score > 0 && this.isHighScore(this.score)) {
            this.isEnteringName = true;
        }
    }

    updateTime(deltaTime) {
        if (this.isGameActive) {
            this.timeRemaining -= deltaTime;
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.endGame();
            }
        }
    }

    addScore(points) {
        this.score += points;
    }

    startFishing() {
        if (this.isGameActive && !this.isFishing) {
            this.isFishing = true;
            this.catchProgress = 0;
            return true;
        }
        return false;
    }

    stopFishing() {
        this.isFishing = false;
        this.catchProgress = 0;
        this.caughtFish = null;
    }
}

export default GameState; 