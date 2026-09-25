// Sound Manager — Web Audio API, procedural SFX, respects Settings (master/sfx/music)
// No external assets — generates cyber tones on-the-fly
// Integrated with Redux settings: sound.master, sound.sfx, sound.music

class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.musicOsc = null;
    this.musicPlaying = false;
    this.volumes = { master: 80, sfx: 80, music: 60 };
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.updateVolumes();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  ensureCtx() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return !!this.ctx;
  }

  setVolumes({ master, sfx, music }) {
    if (master !== undefined) this.volumes.master = master;
    if (sfx !== undefined) this.volumes.sfx = sfx;
    if (music !== undefined) this.volumes.music = music;
    this.updateVolumes();
  }

  updateVolumes() {
    if (!this.masterGain || !this.sfxGain || !this.musicGain) return;
    const m = this.muted ? 0 : this.volumes.master / 100;
    this.masterGain.gain.value = m;
    this.sfxGain.gain.value = this.volumes.sfx / 100;
    this.musicGain.gain.value = (this.volumes.music / 100) * 0.35; // music quieter
  }

  setMuted(muted) {
    this.muted = muted;
    this.updateVolumes();
  }

  // Low-level tone
  playTone({ freq = 440, freqEnd = null, duration = 0.2, type = "sine", gain = 0.5, attack = 0.01, delay = 0, dest = "sfx" }) {
    if (!this.ensureCtx()) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t0 + duration * 0.9);

    gainNode.gain.setValueAtTime(0, t0);
    gainNode.gain.linearRampToValueAtTime(gain, t0 + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    const destNode = dest === "music" ? this.musicGain : this.sfxGain;
    osc.connect(gainNode);
    gainNode.connect(destNode);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
    return { osc, gainNode };
  }

  // Complex SFX definitions
  playSfx(name) {
    if (!this.ensureCtx()) return;
    if (this.volumes.master === 0 || this.volumes.sfx === 0) return;

    switch (name) {
      case "click":
        this.playTone({ freq: 900, freqEnd: 1200, duration: 0.08, type: "square", gain: 0.25, attack: 0.005, release: 0.04 });
        break;
      case "hover":
        this.playTone({ freq: 600, duration: 0.06, type: "sine", gain: 0.12 });
        break;
      case "theme":
        this.playTone({ freq: 400, freqEnd: 800, duration: 0.3, type: "sine", gain: 0.35 });
        this.playTone({ freq: 600, freqEnd: 1000, duration: 0.35, type: "triangle", gain: 0.18, delay: 0.08 });
        break;
      case "attack":
        this.playTone({ freq: 180, freqEnd: 80, duration: 0.18, type: "square", gain: 0.45, attack: 0.005 });
        this.playTone({ freq: 1200, duration: 0.07, type: "square", gain: 0.15, delay: 0.02 });
        break;
      case "hit":
        this.playTone({ freq: 220, freqEnd: 120, duration: 0.15, type: "square", gain: 0.4 });
        // noise-like crack
        this.playTone({ freq: 1800, duration: 0.05, type: "square", gain: 0.12, delay: 0.01 });
        break;
      case "crit":
        this.playTone({ freq: 300, freqEnd: 900, duration: 0.25, type: "sawtooth", gain: 0.4 });
        this.playTone({ freq: 1200, freqEnd: 1600, duration: 0.12, type: "square", gain: 0.18, delay: 0.06 });
        break;
      case "shield":
        this.playTone({ freq: 500, freqEnd: 700, duration: 0.3, type: "sine", gain: 0.3 });
        this.playTone({ freq: 800, duration: 0.4, type: "triangle", gain: 0.12, delay: 0.05 });
        break;
      case "special":
        // charging + blast
        for (let i = 0; i < 4; i++) {
          this.playTone({ freq: 400 + i * 120, duration: 0.12, type: "square", gain: 0.18, delay: i * 0.05 });
        }
        this.playTone({ freq: 150, freqEnd: 40, duration: 0.5, type: "sawtooth", gain: 0.5, delay: 0.22 });
        this.playTone({ freq: 2000, duration: 0.15, type: "square", gain: 0.12, delay: 0.22 });
        break;
      case "heal":
        this.playTone({ freq: 600, freqEnd: 900, duration: 0.3, type: "sine", gain: 0.35 });
        this.playTone({ freq: 900, freqEnd: 1200, duration: 0.3, type: "sine", gain: 0.22, delay: 0.12 });
        this.playTone({ freq: 1200, duration: 0.4, type: "triangle", gain: 0.1, delay: 0.2 });
        break;
      case "victory":
        // arpeggio up
        [0, 0.12, 0.24, 0.4].forEach((d, i) => {
          this.playTone({ freq: 400 * Math.pow(1.5, i), duration: 0.35, type: "sine", gain: 0.3, delay: d });
        });
        this.playTone({ freq: 800, duration: 0.8, type: "triangle", gain: 0.15, delay: 0.5 });
        break;
      case "defeat":
        this.playTone({ freq: 600, freqEnd: 200, duration: 0.6, type: "sawtooth", gain: 0.3 });
        this.playTone({ freq: 150, freqEnd: 80, duration: 0.8, type: "square", gain: 0.25, delay: 0.2 });
        break;
      case "countdown":
        this.playTone({ freq: 880, duration: 0.12, type: "sine", gain: 0.3 });
        break;
      case "notify":
        this.playTone({ freq: 1000, freqEnd: 1400, duration: 0.2, type: "sine", gain: 0.28 });
        break;
      case "error":
        this.playTone({ freq: 300, freqEnd: 150, duration: 0.3, type: "square", gain: 0.35 });
        break;
      default:
        this.playTone({ freq: 500, duration: 0.1, type: "sine", gain: 0.2 });
    }
  }

  // Ambient music — simple cyber drone, respects music volume
  startMusic() {
    if (!this.ensureCtx() || this.musicPlaying) return;
    if (this.volumes.music === 0 || this.volumes.master === 0) return;
    this.musicPlaying = true;
    const playDrone = () => {
      if (!this.musicPlaying) return;
      // subtle pad
      this.playTone({ freq: 55, duration: 4, type: "sine", gain: 0.08, dest: "music" });
      this.playTone({ freq: 110, duration: 4, type: "triangle", gain: 0.04, dest: "music", delay: 0.2 });
      setTimeout(playDrone, 3800);
    };
    playDrone();
  }

  stopMusic() {
    this.musicPlaying = false;
  }
}

const soundManager = new SoundManager();

// Auto-init on first interaction
if (typeof window !== "undefined") {
  const unlock = () => {
    soundManager.init();
    window.removeEventListener("click", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("click", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
}

export default soundManager;
export const playSfx = (name) => soundManager.playSfx(name);
