class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.musicGainNode = null;
        this.musicOscillators = [];
        this.isPlaying = false;
        this.musicVolume = 0.8; // Changed from 0.1 (10%) to 0.8 (80%)
        this.currentNoteIndex = 0;
        this.noteInterval = null;
        this.pendingStart = false; // Flag to indicate music should start when context is resumed
    }

    // Add method to handle resuming audio context
    resumeAudioContext() {
        // Browsers require user interaction to start audio
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('AudioContext resumed successfully');
                // If we were trying to play music before, start it now
                if (this.pendingStart && !this.isPlaying) {
                    this.startBackgroundMusic();
                }
            }).catch(error => {
                console.error('Failed to resume AudioContext:', error);
            });
        }
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

    startBackgroundMusic() {
        // If context is suspended, mark as pending start and wait for resume
        if (this.audioContext.state === 'suspended') {
            this.pendingStart = true;
            return;
        }
        
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.pendingStart = false;
        this.currentNoteIndex = 0;

        // Create a master gain node for music volume control
        this.musicGainNode = this.audioContext.createGain();
        this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.audioContext.currentTime);
        this.musicGainNode.connect(this.audioContext.destination);

        // Define a more complete song structure
        // Each note has: frequency, duration (ms), and volume
        const songNotes = [
            // Introduction
            { freq: 392.00, dur: 800, vol: 0.8 },  // G4
            { freq: 440.00, dur: 800, vol: 0.8 },  // A4
            { freq: 493.88, dur: 1200, vol: 0.9 },  // B4
            
            // Main theme part 1
            { freq: 587.33, dur: 600, vol: 1.0 },  // D5
            { freq: 493.88, dur: 300, vol: 0.8 },  // B4
            { freq: 440.00, dur: 900, vol: 0.9 },  // A4
            { freq: 493.88, dur: 600, vol: 0.9 },  // B4
            { freq: 440.00, dur: 300, vol: 0.8 },  // A4
            { freq: 392.00, dur: 900, vol: 0.9 },  // G4
            
            // Main theme part 2
            { freq: 440.00, dur: 600, vol: 0.9 },  // A4
            { freq: 392.00, dur: 300, vol: 0.8 },  // G4
            { freq: 329.63, dur: 900, vol: 0.8 },  // E4
            { freq: 392.00, dur: 450, vol: 0.9 },  // G4
            { freq: 440.00, dur: 450, vol: 0.9 },  // A4
            { freq: 493.88, dur: 900, vol: 1.0 },  // B4
            
            // Secondary theme part 1
            { freq: 659.25, dur: 450, vol: 0.9 },  // E5
            { freq: 587.33, dur: 450, vol: 0.8 },  // D5
            { freq: 523.25, dur: 450, vol: 0.8 },  // C5
            { freq: 493.88, dur: 450, vol: 0.8 },  // B4
            { freq: 587.33, dur: 600, vol: 0.9 },  // D5
            { freq: 523.25, dur: 300, vol: 0.8 },  // C5
            { freq: 493.88, dur: 900, vol: 0.9 },  // B4
            
            // Secondary theme part 2
            { freq: 523.25, dur: 450, vol: 0.9 },  // C5
            { freq: 493.88, dur: 450, vol: 0.8 },  // B4
            { freq: 440.00, dur: 450, vol: 0.8 },  // A4
            { freq: 392.00, dur: 450, vol: 0.8 },  // G4
            { freq: 440.00, dur: 600, vol: 0.9 },  // A4
            { freq: 493.88, dur: 300, vol: 0.8 },  // B4
            { freq: 587.33, dur: 900, vol: 1.0 },  // D5
            
            // Bridge
            { freq: 493.88, dur: 450, vol: 0.8 },  // B4
            { freq: 554.37, dur: 450, vol: 0.9 },  // C#5
            { freq: 587.33, dur: 900, vol: 0.9 },  // D5
            { freq: 659.25, dur: 450, vol: 1.0 },  // E5
            { freq: 587.33, dur: 450, vol: 0.9 },  // D5
            { freq: 493.88, dur: 900, vol: 0.8 },  // B4
            
            // Outro
            { freq: 440.00, dur: 600, vol: 0.8 },  // A4
            { freq: 493.88, dur: 300, vol: 0.8 },  // B4
            { freq: 440.00, dur: 900, vol: 0.8 },  // A4
            { freq: 392.00, dur: 1200, vol: 0.7 }   // G4 final note
        ];

        // Create a richer harmonized version of the song with bass notes
        const fullSong = [];
        
        // Process each melody note and add harmony and bass
        songNotes.forEach(note => {
            // Add the main melody note
            fullSong.push({
                freq: note.freq,
                dur: note.dur,
                vol: note.vol * 0.08, // Base volume for melody
                type: 'sine',         // Pure tone for melody
                time: 0               // Will be calculated
            });
            
            // Add harmony note - a perfect fifth or third below melody
            const harmonyFreq = note.freq / (Math.random() > 0.5 ? 1.5 : 1.25);
            fullSong.push({
                freq: harmonyFreq,
                dur: note.dur,
                vol: note.vol * 0.03, // Lower volume for harmony
                type: 'triangle',     // Softer timbre for harmony
                time: 0               // Will be calculated
            });
            
            // Add bass note - an octave and a fifth below the melody
            const bassFreq = note.freq / 3;
            fullSong.push({
                freq: bassFreq,
                dur: note.dur,
                vol: note.vol * 0.04, // Medium volume for bass
                type: 'sawtooth',     // Rich timbre for bass
                time: 0               // Will be calculated
            });
        });
        
        // Calculate timing for each note
        let currentTime = 0;
        for (let i = 0; i < fullSong.length; i += 3) { // Process in groups of 3 (melody, harmony, bass)
            fullSong[i].time = currentTime;
            fullSong[i+1].time = currentTime;
            fullSong[i+2].time = currentTime;
            currentTime += fullSong[i].dur; // Advance time based on melody note duration
        }
        
        // Store the total song duration for looping
        const songDuration = currentTime;
        
        // Function to play a note
        const playNote = (note) => {
            if (!this.isPlaying) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = note.type;
            oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime);
            
            // Volume envelope
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(note.vol, this.audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(note.vol * 0.7, this.audioContext.currentTime + (note.dur / 1000) * 0.7);
            gainNode.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + (note.dur / 1000));
            
            oscillator.connect(gainNode);
            gainNode.connect(this.musicGainNode);
            
            oscillator.start();
            this.musicOscillators.push({ oscillator, gain: gainNode });
            
            // Stop oscillator after its duration
            setTimeout(() => {
                if (this.isPlaying) {
                    oscillator.stop();
                    this.musicOscillators = this.musicOscillators.filter(o => o.oscillator !== oscillator);
                }
            }, note.dur + 100); // Add small buffer
        };
        
        // Schedule all notes
        fullSong.forEach(note => {
            setTimeout(() => playNote(note), note.time);
        });
        
        // Setup a loop to restart the song
        this.loopInterval = setTimeout(() => {
            if (this.isPlaying) {
                this.stopBackgroundMusic();
                this.startBackgroundMusic();
            }
        }, songDuration + 500); // Small buffer for smooth looping
    }

    stopBackgroundMusic() {
        this.isPlaying = false;
        
        // Clear all timeouts
        clearTimeout(this.loopInterval);
        
        // Fade out all active oscillators
        this.musicOscillators.forEach(({ oscillator, gain }) => {
            gain.gain.cancelScheduledValues(this.audioContext.currentTime);
            gain.gain.setValueAtTime(gain.gain.value, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.5);
            setTimeout(() => {
                try {
                    oscillator.stop();
                } catch (e) {
                    // Ignore errors if oscillator was already stopped
                }
            }, 500);
        });
        this.musicOscillators = [];
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGainNode) {
            this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.audioContext.currentTime);
        }
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.stopBackgroundMusic();
        } else {
            this.startBackgroundMusic();
        }
        return this.isPlaying;
    }
}

export default AudioManager; 