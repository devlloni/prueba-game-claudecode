/**
 * SoundManager – Procedural Web Audio API chiptune engine.
 * All sounds and music are generated with oscillators; no audio files needed.
 *
 * Usage:
 *   window.Sounds.init()        – call once on first user interaction
 *   window.Sounds.jump()        – etc.
 *   window.Sounds.toggle()      – mute / unmute, returns new "active" state
 *   window.Sounds.startBgMusic()
 *   window.Sounds.stopBgMusic()
 */
class SoundManager {
  constructor() {
    this._ctx      = null;
    this._master   = null;
    this._sfxGain  = null;
    this._musGain  = null;
    this._muted    = false;
    this._musicOn  = false;
    this._musicTimer = null;
    this._ready    = false;
  }

  /* ─── Bootstrap ──────────────────────────────────────────────────────────── */
  init() {
    if (this._ready) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this._ctx     = new AC();
      this._master  = this._ctx.createGain();
      this._sfxGain = this._ctx.createGain();
      this._musGain = this._ctx.createGain();
      this._sfxGain.gain.value = 0.50;
      this._musGain.gain.value = 0.18;
      this._sfxGain.connect(this._master);
      this._musGain.connect(this._master);
      this._master.connect(this._ctx.destination);
      this._ready = true;
    } catch (e) {
      console.warn('SoundManager: Web Audio unavailable', e);
    }
  }

  _resume() {
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
  }

  /* ─── Low-level primitives ───────────────────────────────────────────────── */
  _osc(dest, type, freq, t, dur, vol = 0.3, slide = 0) {
    if (!this._ctx) return;
    const osc  = this._ctx.createOscillator();
    const gain = this._ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  _noise(dest, t, dur, vol = 0.3, cutoff = 800) {
    if (!this._ctx) return;
    const sr  = this._ctx.sampleRate;
    const buf = this._ctx.createBuffer(1, Math.ceil(sr * dur), sr);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src  = this._ctx.createBufferSource();
    src.buffer = buf;
    const flt  = this._ctx.createBiquadFilter();
    flt.type = 'lowpass';
    flt.frequency.value = cutoff;
    const gain = this._ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(flt); flt.connect(gain); gain.connect(dest);
    src.start(t); src.stop(t + dur + 0.02);
  }

  /* ─── Sound effects ──────────────────────────────────────────────────────── */
  jump() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    this._osc(this._sfxGain, 'square',   280, t,      0.06, 0.30, 480);
    this._osc(this._sfxGain, 'square',   480, t+0.05, 0.07, 0.22, 620);
  }

  coin() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    this._osc(this._sfxGain, 'square', 988,  t,      0.07, 0.32);
    this._osc(this._sfxGain, 'square', 1319, t+0.07, 0.10, 0.30);
  }

  stomp() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    this._osc(  this._sfxGain, 'triangle', 180, t, 0.12, 0.40);
    this._noise(this._sfxGain, t, 0.10, 0.25, 600);
  }

  brickBreak() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    this._noise(this._sfxGain, t,      0.07, 0.35, 1400);
    this._noise(this._sfxGain, t+0.05, 0.10, 0.25,  600);
    this._osc(  this._sfxGain, 'sawtooth', 160, t, 0.10, 0.20);
  }

  blockHit() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    this._osc(this._sfxGain, 'square', 220, t,      0.05, 0.28);
    this._osc(this._sfxGain, 'square', 294, t+0.05, 0.09, 0.22);
  }

  powerup() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    [330, 392, 494, 659, 784].forEach((f, i) =>
      this._osc(this._sfxGain, 'square', f, t + i * 0.075, 0.11, 0.28 - i * 0.02)
    );
  }

  starPowerup() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    [330, 415, 523, 659, 784, 988, 1047, 1319].forEach((f, i) =>
      this._osc(this._sfxGain, 'square', f, t + i * 0.06, 0.09, 0.24)
    );
  }

  death() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    [440, 415, 392, 370, 330, 294, 262, 220].forEach((f, i) =>
      this._osc(this._sfxGain, 'square', f, t + i * 0.09, 0.11, 0.30)
    );
  }

  levelComplete() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    const fanfare = [
      [523,0], [659,0.10], [784,0.20], [659,0.30],
      [784,0.42], [880,0.52], [1047,0.64], [1047,0.90]
    ];
    fanfare.forEach(([f, dt]) =>
      this._osc(this._sfxGain, 'square', f, t + dt, 0.18, 0.28)
    );
  }

  gameOver() {
    if (!this._ready || this._muted) return;
    this._resume();
    const t = this._ctx.currentTime;
    [
      [392, 0.00], [330, 0.20], [294, 0.42],
      [262, 0.66], [220, 0.92], [196, 1.22]
    ].forEach(([f, dt]) =>
      this._osc(this._sfxGain, 'triangle', f, t + dt, 0.28, 0.32)
    );
  }

  /* ─── Background music ───────────────────────────────────────────────────── */
  startBgMusic() {
    if (this._musicOn || this._muted || !this._ready) return;
    this._musicOn = true;
    this._resume();
    this._tick();
  }

  stopBgMusic() {
    this._musicOn = false;
    if (this._musicTimer) { clearTimeout(this._musicTimer); this._musicTimer = null; }
  }

  _tick() {
    if (!this._musicOn || !this._ready || this._muted) return;

    const ctx = this._ctx;
    const t   = ctx.currentTime + 0.05; // schedule slightly ahead
    const BPM = 148;
    const B   = 60 / BPM;      // beat = ~0.405 s
    const E   = B / 2;          // eighth note = ~0.203 s

    // ── Melody (square wave, 32 eighth-note steps) ────────────────────────
    const MEL = [
      523,659,784,659, 523,392,440,523,   // bar 1
      659,784,880,784, 659,523,587,659,   // bar 2
      784,880,988,880, 784,659,698,784,   // bar 3
      523,659,784,880, 784,659,523,392,   // bar 4
    ];
    MEL.forEach((f, i) => {
      if (f) this._osc(this._musGain, 'square', f, t + i * E, E * 0.75, 0.22);
    });

    // ── Harmony / counter-melody (pulse wave approximated with square) ────
    const HAR = [
      0,  392,0,  392, 0,  330,0,  330,
      0,  494,0,  494, 0,  392,0,  392,
      0,  587,0,  587, 0,  523,0,  523,
      0,  392,0,  523, 0,  494,0,  330,
    ];
    HAR.forEach((f, i) => {
      if (f) this._osc(this._musGain, 'square', f, t + i * E, E * 0.5, 0.11);
    });

    // ── Bass (triangle wave, quarter notes) ──────────────────────────────
    const BAS = [131, 131, 175, 175, 196, 196, 220, 196,
                 220, 220, 247, 220, 131, 175, 196, 131];
    BAS.forEach((f, i) => {
      this._osc(this._musGain, 'triangle', f * 2, t + i * B, B * 0.85, 0.30);
    });

    // ── Hi-hat / percussion (noise bursts on beats) ───────────────────────
    for (let i = 0; i < 16; i++) {
      // kick on beats 1,3 (i=0,4,8,12)
      if (i % 4 === 0) {
        this._osc(  this._musGain, 'sine', 80, t + i * B, 0.12, 0.28, 40);
        this._noise(this._musGain, t + i * B, 0.06, 0.12, 200);
      }
      // snare on beats 2,4
      if (i % 4 === 2) {
        this._noise(this._musGain, t + i * B, 0.10, 0.18, 3000);
        this._osc(  this._musGain, 'square', 220, t + i * B, 0.05, 0.10);
      }
      // hi-hat every eighth
      this._noise(this._musGain, t + i * B, 0.03, 0.06, 8000);
    }

    // Loop: 32 eighth notes = 16 beats
    const loopDur = 16 * B;
    this._musicTimer = setTimeout(() => this._tick(), (loopDur - 0.15) * 1000);
  }

  /* ─── Mute / unmute ──────────────────────────────────────────────────────── */
  toggle() {
    if (this._muted) {
      this._muted = false;
      if (this._master) this._master.gain.value = 1;
      this.startBgMusic();
    } else {
      this._muted = true;
      if (this._master) this._master.gain.value = 0;
      this.stopBgMusic();
    }
    return !this._muted; // true = sound is ON
  }

  get muted() { return this._muted; }
}

window.Sounds = new SoundManager();
