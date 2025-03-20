class GameState {
    constructor() {
        this.score = 0;
        this.timeRemaining = 60; // 60 seconds game time
        this.isGameActive = false;
        this.isFishing = false;
        this.catchProgress = 0;
        this.caughtFish = null;
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