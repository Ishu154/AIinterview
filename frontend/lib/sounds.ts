/**
 * Sound Effects Utilities
 * Play sound effects for various user actions
 */

// Simple beep generator using Web Audio API
class SoundPlayer {
    private audioContext: AudioContext | null = null;
    private volume: number = 0.3;

    constructor() {
        if (typeof window !== 'undefined') {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration / 1000
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    /**
     * Play a success sound
     */
    public success() {
        this.playTone(800, 100);
        setTimeout(() => this.playTone(1000, 100), 100);
    }

    /**
     * Play an error sound
     */
    public error() {
        this.playTone(300, 200);
        setTimeout(() => this.playTone(200, 200), 200);
    }

    /**
     * Play a start recording sound
     */
    public startRecording() {
        this.playTone(600, 100);
    }

    /**
     * Play a stop recording sound
     */
    public stopRecording() {
        this.playTone(400, 150);
    }

    /**
     * Play a click sound
     */
    public click() {
        this.playTone(500, 50, 'square');
    }

    /**
     * Play a notification sound
     */
    public notify() {
        this.playTone(700, 80);
        setTimeout(() => this.playTone(900, 80), 150);
    }

    /**
     * Set volume (0-1)
     */
    public setVolume(vol: number) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Create singleton instance
const soundPlayer = new SoundPlayer();

export default soundPlayer;

// Export individual functions for convenience
export const playSuccess = () => soundPlayer.success();
export const playError = () => soundPlayer.error();
export const playStartRecording = () => soundPlayer.startRecording();
export const playStopRecording = () => soundPlayer.stopRecording();
export const playClick = () => soundPlayer.click();
export const playNotify = () => soundPlayer.notify();
export const setSoundVolume = (volume: number) => soundPlayer.setVolume(volume);
