/**
 * Procedural Web Audio Synth for Snake, Water, Gun
 * Zero external asset dependencies. Works offline and instantly.
 */

import { Choice } from '../game/rules';

class SoundFX {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    // Lazy audio context initialization upon user interaction
    const savedMute = localStorage.getItem('swg_muted');
    if (savedMute !== null) {
      this.muted = savedMute === 'true';
    }
    const savedVol = localStorage.getItem('swg_volume');
    if (savedVol !== null) {
      this.volume = Math.max(0, Math.min(1, parseFloat(savedVol) || 0.5));
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('swg_muted', String(muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('swg_volume', String(this.volume));
  }

  /**
   * Snappy arcade UI click
   */
  public click() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.05);

      gain.gain.setValueAtTime(0.2 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {
      // Ignored if audio context is blocked
    }
  }

  /**
   * Countdown tick (pitch scales with urgency)
   */
  public tick(pitchMultiplier = 1) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 * pitchMultiplier, t);
      osc.frequency.exponentialRampToValueAtTime(300 * pitchMultiplier, t + 0.08);

      gain.gain.setValueAtTime(0.3 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch {
      // Audio block ignored
    }
  }

  /**
   * Dramatic clash impact sound
   */
  public clash() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // Low boom
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);

      oscGain.gain.setValueAtTime(0.5 * this.volume, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);

      // Metallic impact transient
      const metalOsc = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();
      metalOsc.type = 'square';
      metalOsc.frequency.setValueAtTime(520, t);
      metalOsc.frequency.exponentialRampToValueAtTime(90, t + 0.15);

      metalGain.gain.setValueAtTime(0.18 * this.volume, t);
      metalGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      metalOsc.connect(metalGain);
      metalGain.connect(this.ctx.destination);
      metalOsc.start(t);
      metalOsc.stop(t + 0.15);
    } catch {
      // Audio block ignored
    }
  }

  /**
   * Plays unique sound for each choice
   */
  public choiceSound(choice: Choice) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      if (choice === 'snake') {
        // Hiss & Strike: Noise + FM high pitch sweep
        const bufferSize = this.ctx.sampleRate * 0.25;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3500, t);
        filter.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
        filter.Q.setValueAtTime(4, t);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35 * this.volume, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(t);
      } else if (choice === 'water') {
        // Splash & Liquid Resonance
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.linearRampToValueAtTime(650, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.28);

        oscGain.gain.setValueAtTime(0.4 * this.volume, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      } else if (choice === 'gun') {
        // Futuristic blast / laser shot
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.22);

        oscGain.gain.setValueAtTime(0.4 * this.volume, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      }
    } catch {
      // Audio block ignored
    }
  }

  /**
   * Round win fanfare
   */
  public win() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Audio block ignored
    }
  }

  /**
   * Round lose sting
   */
  public lose() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [440, 392, 349.23, 293.66]; // Descending minor
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.09;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.22 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch {
      // Audio block ignored
    }
  }

  /**
   * Round draw chime
   */
  public draw() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [440, 554.37].forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // Audio block ignored
    }
  }

  /**
   * Match champion victory celebration fanfare
   */
  public matchVictory() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99],       // C Major
        [587.33, 739.99, 880.0],        // D Major
        [659.25, 830.61, 987.77],       // E Major
        [1046.5, 1318.51, 1567.98],     // High C Major chord!
      ];
      const now = this.ctx.currentTime;

      chords.forEach((chord, step) => {
        const stepTime = now + step * 0.16;
        const duration = step === 3 ? 0.8 : 0.22;
        chord.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = step === 3 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, stepTime);

          gain.gain.setValueAtTime(0.2 * this.volume, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(stepTime);
          osc.stop(stepTime + duration);
        });
      });
    } catch {
      // Audio block ignored
    }
  }
}

export const audioSystem = new SoundFX();
