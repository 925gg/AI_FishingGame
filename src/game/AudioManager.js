class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSound(frequency, duration, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playCastSound() {
        this.playSound(440, 0.2); // A4 note, short duration
    }

    playBiteSound() {
        // Play two quick beeps
        this.playSound(880, 0.1); // Higher pitch
        setTimeout(() => this.playSound(880, 0.1), 150);
    }

    playCatchSound() {
        // Play ascending notes
        this.playSound(440, 0.1);
        setTimeout(() => this.playSound(554.37, 0.1), 100); // C#5
        setTimeout(() => this.playSound(659.25, 0.15), 200); // E5
    }

    playMissSound() {
        // Play descending notes
        this.playSound(440, 0.1);
        setTimeout(() => this.playSound(392, 0.1), 100); // G4
        setTimeout(() => this.playSound(329.63, 0.15), 200); // E4
    }
}

export default AudioManager; 