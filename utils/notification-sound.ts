// Notification sound utility for chat applications
class NotificationSound {
  private audioContext: AudioContext | null = null;
  private chimeBuffer: AudioBuffer | null = null;
  private isInitialized = false;

  // Initialize the audio context and load the chime sound
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Generate a pleasant chime sound
      this.chimeBuffer = this.generateChime();
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize notification sound:', error);
    }
  }

  // Generate a pleasant chime sound using Web Audio API
  private generateChime(): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.5; // 500ms
    const frameCount = sampleRate * duration;
    
    const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Create a pleasant chime with multiple harmonics
    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3); // Exponential decay
      
      // Fundamental frequency (880 Hz - A5 note)
      const fundamental = Math.sin(2 * Math.PI * 880 * t);
      
      // Harmonics for richness
      const harmonic1 = Math.sin(2 * Math.PI * 1760 * t) * 0.5;
      const harmonic2 = Math.sin(2 * Math.PI * 2640 * t) * 0.25;
      
      channelData[i] = (fundamental + harmonic1 + harmonic2) * envelope * 0.3;
    }

    return buffer;
  }

  // Play the chime sound
  async play(volume: number = 0.7) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.audioContext || !this.chimeBuffer) {
      console.warn('Notification sound not available');
      return;
    }

    try {
      // Resume audio context if suspended (required by modern browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.chimeBuffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Set volume (0.0 to 1.0)
      gainNode.gain.value = Math.max(0, Math.min(1, volume));
      
      source.start(0);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  // Play a different sound for incoming calls
  async playIncomingCall(volume: number = 0.7) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.audioContext) {
      console.warn('Notification sound not available');
      return;
    }

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Generate a ringtone-like sound
      const sampleRate = this.audioContext.sampleRate;
      const duration = 0.3;
      const frameCount = sampleRate * duration;
      
      const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = buffer.getChannelData(0);

      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 2);
        
        // Alternating frequencies for ringtone effect
        const freq = 800 + Math.sin(t * 4) * 100;
        channelData[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.4;
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Set volume (0.0 to 1.0)
      gainNode.gain.value = Math.max(0, Math.min(1, volume));
      
      source.start(0);
    } catch (error) {
      console.warn('Failed to play incoming call sound:', error);
    }
  }

  // Clean up resources
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.chimeBuffer = null;
    this.isInitialized = false;
  }
}

// Create a singleton instance
const notificationSound = new NotificationSound();

export default notificationSound;
