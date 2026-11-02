/**
 * Web Audio Engine for Dr. Ali Chams Eddine Portfolio
 * Synthesizes atmospheric sound design pieces and provides real-time audio analysis for visualizers.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private playbackStartTime: number = 0;
  private playbackDuration: number = 45; // 45 seconds ambient loop
  private volume: number = 0.8;
  private customAudioElement: HTMLAudioElement | null = null;
  private customAudioSource: MediaElementAudioSourceNode | null = null;
  private timerInterval: number | null = null;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onStateChangeCallback: ((isPlaying: boolean, trackId: string | null) => void) | null = null;

  // Stems for the Interactive Sound Lab
  private labNodes: {
    drones?: GainNode;
    water?: GainNode;
    wind?: GainNode;
    percussion?: GainNode;
    cleanup?: () => void;
  } = {};

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.customAudioElement) {
      this.customAudioElement.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setOnTimeUpdate(cb: (time: number, duration: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public setOnStateChange(cb: (isPlaying: boolean, trackId: string | null) => void) {
    this.onStateChangeCallback = cb;
  }

  public stopAll() {
    // Clear custom audio
    if (this.customAudioElement) {
      this.customAudioElement.pause();
      this.customAudioElement.currentTime = 0;
    }

    // Stop synthetic active nodes
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // ignore already stopped
      }
    });
    this.activeNodes = [];

    // Stop lab stems if playing
    if (this.labNodes.cleanup) {
      this.labNodes.cleanup();
      this.labNodes = {};
    }

    if (this.timerInterval) {
      window.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(false, null);
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(0, this.playbackDuration);
    }
  }

  public playTrack(trackId: string, customFile?: File) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentTrackId === trackId) {
      this.pause();
      return;
    }

    this.stopAll();

    if (customFile) {
      this.playCustomAudio(trackId, customFile);
      return;
    }

    // Synthesize atmospheric soundtrack based on trackId
    this.isPlaying = true;
    this.currentTrackId = trackId;
    this.playbackStartTime = this.ctx.currentTime;
    this.playbackDuration = 45;

    switch (trackId) {
      case 'cadounis':
        this.synthesizeCadounis();
        break;
      case 'eau':
        this.synthesizeQuandLeauDisparait();
        break;
      case 'alwokor':
        this.synthesizeAlWokor();
        break;
      case 'ibnkhaldoun':
        this.synthesizeIbnKhaldoun();
        break;
      case 'hayat':
        this.synthesizeHayat();
        break;
      case 'joudour':
        this.synthesizeJoudour();
        break;
      default:
        this.synthesizeCadounis();
        break;
    }

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(true, trackId);
    }

    // Setup timer ticker
    this.timerInterval = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const elapsed = (this.ctx.currentTime - this.playbackStartTime) % this.playbackDuration;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(elapsed, this.playbackDuration);
      }
    }, 200);
  }

  public pause() {
    this.stopAll();
  }

  public toggleTrack(trackId: string) {
    if (this.isPlaying && this.currentTrackId === trackId) {
      this.stopAll();
    } else {
      this.playTrack(trackId);
    }
  }

  private playCustomAudio(trackId: string, file: File) {
    if (!this.ctx || !this.masterGain) return;

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    this.customAudioElement = audio;
    audio.volume = this.volume;

    try {
      this.customAudioSource = this.ctx.createMediaElementSource(audio);
      this.customAudioSource.connect(this.masterGain);
    } catch {
      // If already connected, pass
    }

    audio.play().then(() => {
      this.isPlaying = true;
      this.currentTrackId = trackId;
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(true, trackId);
      }
    }).catch(err => console.error("Audio playback error:", err));

    audio.ontimeupdate = () => {
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(audio.currentTime, audio.duration || 60);
      }
    };

    audio.onended = () => {
      this.stopAll();
    };
  }

  /* ---------------- SOUND DESIGN SYNTHESIS ENGINES ---------------- */

  // 1. "Cadence" (Cadounis) - Industrial theatrical tensions, resonant metallic gong, sub harmonic pulse
  private synthesizeCadounis() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Sub-bass pulse
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, now); // A1 note
    subGain.gain.setValueAtTime(0.4, now);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);

    // Resonant metallic filtered pad
    const padOsc = ctx.createOscillator();
    const padGain = ctx.createGain();
    const padFilter = ctx.createBiquadFilter();
    padOsc.type = 'sawtooth';
    padOsc.frequency.setValueAtTime(110, now);
    padFilter.type = 'bandpass';
    padFilter.frequency.setValueAtTime(440, now);
    padFilter.Q.setValueAtTime(4, now);

    // Filter sweep LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, now);
    lfoGain.gain.setValueAtTime(250, now);
    lfo.connect(padFilter.frequency);
    lfo.start(now);

    padGain.gain.setValueAtTime(0.18, now);
    padOsc.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(this.masterGain);
    padOsc.start(now);

    // Periodic metallic bell strikes (every 4 seconds)
    const bellInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const bell = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bell.type = 'triangle';
      bell.frequency.setValueAtTime(329.63, t); // E4
      bGain.gain.setValueAtTime(0.3, t);
      bGain.gain.exponentialRampToValueAtTime(0.001, t + 3.5);
      bell.connect(bGain);
      bGain.connect(this.masterGain);
      bell.start(t);
      bell.stop(t + 3.6);
    }, 4000);

    this.activeNodes.push({
      stop: () => {
        subOsc.stop();
        padOsc.stop();
        lfo.stop();
        window.clearInterval(bellInterval);
      }
    });
  }

  // 2. "Quand l'eau disparaît" - Fluid aquatic textures, filtered noise drops, crystalline sweeps
  private synthesizeQuandLeauDisparait() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Pink/White noise water texture
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const waterFilter = ctx.createBiquadFilter();
    waterFilter.type = 'lowpass';
    waterFilter.frequency.setValueAtTime(800, now);

    const waveLfo = ctx.createOscillator();
    waveLfo.frequency.setValueAtTime(0.15, now);
    const waveLfoGain = ctx.createGain();
    waveLfoGain.gain.setValueAtTime(400, now);
    waveLfo.connect(waterFilter.frequency);
    waveLfo.start(now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);

    noiseSource.connect(waterFilter);
    waterFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start(now);

    // Crystalline drip generator
    const dripInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const drip = this.ctx.createOscillator();
      const dGain = this.ctx.createGain();
      drip.type = 'sine';
      const startFreq = 800 + Math.random() * 800;
      drip.frequency.setValueAtTime(startFreq, t);
      drip.frequency.exponentialRampToValueAtTime(startFreq * 1.5, t + 0.15);
      dGain.gain.setValueAtTime(0.2, t);
      dGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      drip.connect(dGain);
      dGain.connect(this.masterGain);
      drip.start(t);
      drip.stop(t + 0.45);
    }, 1800);

    this.activeNodes.push({
      stop: () => {
        noiseSource.stop();
        waveLfo.stop();
        window.clearInterval(dripInterval);
      }
    });
  }

  // 3. "Al-Wokor" - Dramatic radiophonic fiction, haunting chords, tape warmth
  private synthesizeAlWokor() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Minor chord drone (D minor: D2, A2, F3)
    const freqs = [73.42, 110.0, 174.61, 220.0];
    const oscs: OscillatorNode[] = [];
    const chordGain = ctx.createGain();
    chordGain.gain.setValueAtTime(0.12, now);

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(chordGain);
      osc.start(now);
      oscs.push(osc);
    });

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    chordGain.connect(filter);
    filter.connect(this.masterGain);

    // Dramatic breath/radio static sweep
    const radioNoise = ctx.createOscillator();
    radioNoise.type = 'sawtooth';
    radioNoise.frequency.setValueAtTime(55, now);
    const rGain = ctx.createGain();
    rGain.gain.setValueAtTime(0.05, now);
    radioNoise.connect(rGain);
    rGain.connect(this.masterGain);
    radioNoise.start(now);

    this.activeNodes.push({
      stop: () => {
        oscs.forEach(o => o.stop());
        radioNoise.stop();
      }
    });
  }

  // 4. "Ibn Khaldoun" - Historical epic, modal oriental harmonics (Bayati mode), warm resonator
  private synthesizeIbnKhaldoun() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Bayati / Rast modal tonic (D - A - D - G)
    const rootOsc = ctx.createOscillator();
    rootOsc.type = 'sawtooth';
    rootOsc.frequency.setValueAtTime(146.83, now); // D3

    const fifthOsc = ctx.createOscillator();
    fifthOsc.type = 'sine';
    fifthOsc.frequency.setValueAtTime(220.00, now); // A3

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(293.66, now); // D4
    filter.Q.setValueAtTime(3.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);

    rootOsc.connect(filter);
    fifthOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    rootOsc.start(now);
    fifthOsc.start(now);

    // Subtle framing drum beat (Daf/Bendir simulation)
    const drumInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const drumOsc = this.ctx.createOscillator();
      const drumGain = this.ctx.createGain();
      drumOsc.frequency.setValueAtTime(120, t);
      drumOsc.frequency.exponentialRampToValueAtTime(45, t + 0.25);
      drumGain.gain.setValueAtTime(0.35, t);
      drumGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      drumOsc.connect(drumGain);
      drumGain.connect(this.masterGain);
      drumOsc.start(t);
      drumOsc.stop(t + 0.65);
    }, 2800);

    this.activeNodes.push({
      stop: () => {
        rootOsc.stop();
        fifthOsc.stop();
        window.clearInterval(drumInterval);
      }
    });
  }

  // 5. "Hayat" - Cinema study, delicate micro-textures, intimate acoustic presence
  private synthesizeHayat() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(196.00, now); // G3
    osc2.frequency.setValueAtTime(246.94, now); // B3

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);

    this.activeNodes.push({
      stop: () => {
        osc1.stop();
        osc2.stop();
      }
    });
  }

  // 6. "Joudour" (Festival International de Gabès) - Oasis field synthesis, wind rustle & harmonic roots
  private synthesizeJoudour() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const drone = ctx.createOscillator();
    drone.type = 'triangle';
    drone.frequency.setValueAtTime(82.41, now); // E2

    const chord = ctx.createOscillator();
    chord.type = 'sine';
    chord.frequency.setValueAtTime(329.63, now); // E4

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);

    drone.connect(gain);
    chord.connect(gain);
    gain.connect(this.masterGain);

    drone.start(now);
    chord.start(now);

    this.activeNodes.push({
      stop: () => {
        drone.stop();
        chord.stop();
      }
    });
  }

  /* ---------------- INTERACTIVE SOUND LAB MULTI-STEM MIXER ---------------- */

  public startSoundLab(stems: { drones: number; water: number; wind: number; percussion: number }) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.stopAll();

    const ctx = this.ctx;
    const now = ctx.currentTime;
    this.isPlaying = true;
    this.currentTrackId = 'sound-lab';

    // 1. Drone Stem
    const droneOsc = ctx.createOscillator();
    droneOsc.type = 'triangle';
    droneOsc.frequency.setValueAtTime(110, now); // A2
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(stems.drones * 0.4, now);
    droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start(now);

    // 2. Water / Texture Stem
    const waterOsc = ctx.createOscillator();
    waterOsc.type = 'sine';
    waterOsc.frequency.setValueAtTime(587.33, now); // D5
    const waterGain = ctx.createGain();
    waterGain.gain.setValueAtTime(stems.water * 0.25, now);
    const waterFilter = ctx.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.setValueAtTime(600, now);
    waterOsc.connect(waterFilter);
    waterFilter.connect(waterGain);
    waterGain.connect(this.masterGain);
    waterOsc.start(now);

    // 3. Wind / Atmosphere Stem
    const windOsc = ctx.createOscillator();
    windOsc.type = 'sawtooth';
    windOsc.frequency.setValueAtTime(65, now);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(350, now);
    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(stems.wind * 0.3, now);
    windOsc.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    windOsc.start(now);

    // 4. Percussion Stem (Gentle pulse)
    const percGain = ctx.createGain();
    percGain.gain.setValueAtTime(stems.percussion, now);
    const percInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const pOsc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      pOsc.frequency.setValueAtTime(220, t);
      pOsc.frequency.exponentialRampToValueAtTime(70, t + 0.15);
      pGain.gain.setValueAtTime(this.labNodes.percussion?.gain.value || 0.2, t);
      pGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      pOsc.connect(pGain);
      pGain.connect(this.masterGain);
      pOsc.start(t);
      pOsc.stop(t + 0.45);
    }, 2000);

    this.labNodes = {
      drones: droneGain,
      water: waterGain,
      wind: windGain,
      percussion: percGain,
      cleanup: () => {
        droneOsc.stop();
        waterOsc.stop();
        windOsc.stop();
        window.clearInterval(percInterval);
      }
    };

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(true, 'sound-lab');
    }
  }

  public updateSoundLabStem(stem: 'drones' | 'water' | 'wind' | 'percussion', value: number) {
    if (!this.ctx) return;
    const val = Math.max(0, Math.min(1, value));
    const now = this.ctx.currentTime;

    if (stem === 'drones' && this.labNodes.drones) {
      this.labNodes.drones.gain.setTargetAtTime(val * 0.4, now, 0.05);
    } else if (stem === 'water' && this.labNodes.water) {
      this.labNodes.water.gain.setTargetAtTime(val * 0.25, now, 0.05);
    } else if (stem === 'wind' && this.labNodes.wind) {
      this.labNodes.wind.gain.setTargetAtTime(val * 0.3, now, 0.05);
    } else if (stem === 'percussion' && this.labNodes.percussion) {
      this.labNodes.percussion.gain.setTargetAtTime(val * 0.35, now, 0.05);
    }
  }

  public getPlaybackState(): { isPlaying: boolean; trackId: string | null } {
    return {
      isPlaying: this.isPlaying,
      trackId: this.currentTrackId
    };
  }
}

export const audioEngine = new AudioEngine();
