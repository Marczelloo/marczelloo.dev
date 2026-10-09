// Audio for the case board. Rain against the window and paper rustle are
// synthesized with the Web Audio API; thunder is recorded (see ../thunder.ts)
// and only fetched once sound is switched on.

import { THUNDER, THUNDER_BY_ID, type Strike, type StrikeClass } from "../thunder";

type NoiseKind = "white" | "pink" | "brown";
type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

const MASTER_LEVEL = 0.5;
const RAIN_LEVEL = 0.3; // rain sits well under thunder
const THUNDER_LEVEL = 1;
const SFX_LEVEL = 0.7;
const FADE_SECONDS = 0.6;

const LOWPASS: Record<StrikeClass, number> = { close: 9000, mid: 5000, far: 1600 };
const CLASS_GAIN: Record<StrikeClass, number> = { close: 1, mid: 0.8, far: 0.62 };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Builds a mono noise buffer that loops without a click: the tail is
 * equal-power crossfaded into the head, so the last sample flows into the first.
 */
function makeLoopBuffer(ctx: AudioContext, seconds: number, kind: NoiseKind): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.floor(seconds * rate);
  const fade = Math.floor(0.25 * rate);
  const raw = new Float32Array(length + fade);

  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  let brown = 0;

  for (let i = 0; i < raw.length; i += 1) {
    const w = Math.random() * 2 - 1;
    if (kind === "white") {
      raw[i] = w;
    } else if (kind === "pink") {
      // Paul Kellet's economy pink filter.
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      raw[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    } else {
      brown = (brown + 0.02 * w) / 1.02;
      raw[i] = brown * 3.5;
    }
  }

  const buffer = ctx.createBuffer(1, length, rate);
  const out = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) out[i] = raw[i];
  for (let i = 0; i < fade; i += 1) {
    const t = (i / fade) * (Math.PI / 2);
    out[i] = raw[i] * Math.sin(t) + raw[length + i] * Math.cos(t);
  }
  return buffer;
}

export class CaseAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private thunderBus: GainNode | null = null;
  private dropBus: GainNode | null = null;
  private white: AudioBuffer | null = null;
  private thunderBuffers = new Map<string, AudioBuffer>();
  private hissGains: GainNode[] = [];
  private rumbleGain: GainNode | null = null;

  private enabled = false;
  private disposed = false;
  private tickTimer: number | null = null;
  private suspendTimer: number | null = null;
  private nextDropAt = 0;
  private dropRate = 9;
  private nextModAt = 0;

  /** Creates / resumes the AudioContext. Must be called from a user gesture. */
  start(): void {
    if (this.disposed) return;
    if (!this.ctx) this.build();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master || this.disposed) return;

    if (this.suspendTimer !== null) {
      window.clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }
    if (on && ctx.state === "suspended") ctx.resume().catch(() => {});

    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(on ? MASTER_LEVEL : 0, now + FADE_SECONDS);

    if (!on) {
      // Once silent, stop burning CPU on a running context.
      this.suspendTimer = window.setTimeout(() => {
        this.suspendTimer = null;
        if (!this.enabled && this.ctx && this.ctx.state === "running") {
          this.ctx.suspend().catch(() => {});
        }
      }, FADE_SECONDS * 1000 + 100);
    }
  }

  /**
   * Plays a strike so that its hit lands `strike.delay` seconds from now, the
   * moment the storm timed it for. Recordings still loading are skipped.
   */
  thunder(strike: Strike): void {
    const ctx = this.ctx;
    const bus = this.thunderBus;
    const sample = THUNDER_BY_ID.get(strike.sample);
    const buffer = sample && this.thunderBuffers.get(sample.id);
    if (!ctx || !bus || !sample || !buffer || !this.enabled || this.disposed || ctx.state !== "running") return;

    const rate = strike.rate;
    // File seconds between where playback starts and the hit.
    const lead = sample.onset - sample.skip;
    const now = ctx.currentTime;
    let startAt = now + strike.delay - lead / rate;
    let offset = sample.skip;
    if (startAt < now) {
      offset += (now - startAt) * rate;
      startAt = now;
    }
    const end = Math.min(sample.end, buffer.duration);
    if (offset >= end - 0.5) return;
    const stopAt = startAt + (end - offset) / rate;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = rate;

    // Heard through a closed window: the nearer the strike, the more top end survives.
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = LOWPASS[sample.cls];
    lp.Q.value = 0.5;

    const env = ctx.createGain();
    const level = sample.gain * CLASS_GAIN[sample.cls] * clamp(strike.level, 0, 1);
    env.gain.setValueAtTime(0, startAt);
    env.gain.linearRampToValueAtTime(level, startAt + 0.012);
    env.gain.setValueAtTime(level, Math.max(startAt + 0.02, stopAt - 1.6));
    env.gain.linearRampToValueAtTime(0, stopAt);

    const pan = ctx.createStereoPanner();
    pan.pan.value = clamp(strike.pan, -1, 1);

    src.connect(lp).connect(env).connect(pan).connect(bus);
    src.start(startAt, offset);
    src.stop(stopAt + 0.05);
    src.onended = () => pan.disconnect();
  }

  paper(): void {
    const ctx = this.ctx;
    const white = this.white;
    const bus = this.sfxBus;
    if (!ctx || !white || !bus || !this.enabled || this.disposed) return;

    const grains = 2 + Math.floor(Math.random() * 3);
    const now = ctx.currentTime;
    for (let g = 0; g < grains; g += 1) {
      const when = now + (g / grains) * 0.17 + rand(0, 0.03);
      const dur = rand(0.045, 0.09);

      const src = ctx.createBufferSource();
      src.buffer = white;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = rand(1500, 5000);
      bp.Q.value = rand(0.8, 2);
      const env = ctx.createGain();
      const peak = rand(0.18, 0.35);
      env.gain.setValueAtTime(0, when);
      env.gain.linearRampToValueAtTime(peak, when + 0.004);
      env.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      const pan = ctx.createStereoPanner();
      pan.pan.value = rand(-0.4, 0.4);

      src.connect(bp).connect(env).connect(pan).connect(bus);
      src.start(when, rand(0, white.duration - 0.2), dur + 0.02);
      src.onended = () => pan.disconnect();
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.enabled = false;
    if (this.tickTimer !== null) window.clearInterval(this.tickTimer);
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    this.tickTimer = null;
    this.suspendTimer = null;
    const ctx = this.ctx;
    this.ctx = null;
    this.master = null;
    this.sfxBus = null;
    this.thunderBus = null;
    this.dropBus = null;
    this.white = null;
    this.thunderBuffers.clear();
    this.hissGains = [];
    this.rumbleGain = null;
    if (ctx && ctx.state !== "closed") ctx.close().catch(() => {});
  }

  // --- graph -------------------------------------------------------------

  private build(): void {
    const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!Ctor) return;
    let ctx: AudioContext;
    try {
      ctx = new Ctor();
    } catch {
      return;
    }
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -10;
    limiter.knee.value = 12;
    limiter.ratio.value = 6;
    limiter.attack.value = 0.005;
    limiter.release.value = 0.25;
    master.connect(limiter).connect(ctx.destination);
    this.master = master;

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = SFX_LEVEL;
    this.sfxBus.connect(master);

    this.thunderBus = ctx.createGain();
    this.thunderBus.gain.value = THUNDER_LEVEL;
    this.thunderBus.connect(master);

    const pinkBuf = makeLoopBuffer(ctx, 5, "pink");
    this.white = makeLoopBuffer(ctx, 2, "white");

    this.buildRain(ctx, master, pinkBuf, makeLoopBuffer(ctx, 6, "brown"));
    this.loadThunder(ctx);

    this.tickTimer = window.setInterval(() => this.tick(), 120);

    // Apply a setEnabled(true) that arrived before the context existed.
    if (this.enabled) this.setEnabled(true);
  }

  private buildRain(ctx: AudioContext, master: GainNode, pinkBuf: AudioBuffer, brownBuf: AudioBuffer): void {
    const rainBus = ctx.createGain();
    rainBus.gain.value = RAIN_LEVEL;
    rainBus.connect(master);

    // (a) Body + sheen: pink noise through two bandpasses, slowly modulated.
    const layers: { freq: number; q: number; level: number }[] = [
      { freq: 1400, q: 0.6, level: 0.7 },
      { freq: 3000, q: 0.8, level: 0.45 },
    ];
    for (const layer of layers) {
      const src = ctx.createBufferSource();
      src.buffer = pinkBuf;
      src.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = layer.freq;
      bp.Q.value = layer.q;
      const g = ctx.createGain();
      g.gain.value = layer.level;
      src.connect(bp).connect(g).connect(rainBus);
      src.start(0, rand(0, pinkBuf.duration));
      this.hissGains.push(g);
    }

    // (b) Low rumble of distant rain.
    const rumbleSrc = ctx.createBufferSource();
    rumbleSrc.buffer = brownBuf;
    rumbleSrc.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 400;
    lp.Q.value = 0.5;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.9;
    rumbleSrc.connect(lp).connect(rumbleGain).connect(rainBus);
    rumbleSrc.start(0, rand(0, brownBuf.duration));
    this.rumbleGain = rumbleGain;

    // (c) Droplet ticks on the glass are scheduled from tick().
    this.dropBus = ctx.createGain();
    this.dropBus.gain.value = 0.55;
    this.dropBus.connect(rainBus);
  }

  /** Lookahead scheduler: droplets + slow rain-intensity drift. */
  private tick(): void {
    const ctx = this.ctx;
    if (!ctx || !this.enabled || ctx.state !== "running") return;
    const now = ctx.currentTime;

    if (now >= this.nextModAt) {
      this.nextModAt = now + rand(0.8, 1.8);
      for (const g of this.hissGains) {
        g.gain.setTargetAtTime(rand(0.3, 0.85), now, 0.7);
      }
      this.rumbleGain?.gain.setTargetAtTime(rand(0.6, 1.1), now, 1.2);
      this.dropRate = clamp(this.dropRate + rand(-2.5, 2.5), 5, 15);
    }

    if (this.nextDropAt < now) this.nextDropAt = now;
    while (this.nextDropAt < now + 0.25) {
      this.droplet(this.nextDropAt);
      this.nextDropAt += -Math.log(1 - Math.random()) / this.dropRate;
    }
  }

  private droplet(when: number): void {
    const ctx = this.ctx;
    const white = this.white;
    const bus = this.dropBus;
    if (!ctx || !white || !bus) return;

    const dur = rand(0.012, 0.035);
    const src = ctx.createBufferSource();
    src.buffer = white;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = rand(1800, 7500);
    bp.Q.value = rand(2, 7);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(rand(0.15, 0.6), when + 0.001);
    env.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    const pan = ctx.createStereoPanner();
    pan.pan.value = rand(-0.9, 0.9);

    src.connect(bp).connect(env).connect(pan).connect(bus);
    src.start(when, rand(0, white.duration - 0.1), dur + 0.02);
    src.onended = () => pan.disconnect();
  }

  // --- thunder -----------------------------------------------------------

  private loadThunder(ctx: AudioContext): void {
    for (const sample of THUNDER) {
      fetch(sample.url)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.statusText))))
        .then((data) => ctx.decodeAudioData(data))
        .then((buffer) => {
          if (this.ctx === ctx) this.thunderBuffers.set(sample.id, buffer);
        })
        .catch(() => {});
    }
  }
}
