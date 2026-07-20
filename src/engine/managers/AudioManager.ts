import { Manager, type EngineContext } from '../core/Manager';

interface SoundHandle {
  buffer: AudioBuffer;
  gain: GainNode;
  source?: AudioBufferSourceNode;
  loop: boolean;
  baseVolume: number;
}

/**
 * Web Audio architecture (wiring only — no content yet).
 *
 * The AudioContext is created lazily on the first user gesture to satisfy
 * autoplay policies. A master gain node fronts all sounds so muting/volume is
 * a single-node operation, and each registered sound gets its own gain for
 * independent crossfades. Content, sprites and spatialisation are layered on
 * in a later phase.
 */
export class AudioManager extends Manager {
  private context?: AudioContext;
  private master?: GainNode;
  private readonly sounds = new Map<string, SoundHandle>();
  private _muted: boolean;
  private _volume: number;
  private unlocked = false;

  constructor(ctx: EngineContext) {
    super(ctx);
    this._muted = this.config.audio.mutedByDefault;
    this._volume = this.config.audio.masterVolume;
  }

  get muted(): boolean {
    return this._muted;
  }
  get volume(): number {
    return this._volume;
  }
  get isUnlocked(): boolean {
    return this.unlocked;
  }

  override init(): void {
    if (!this.ctx.isBrowser) return;
    // Defer context creation until a genuine user gesture unlocks audio.
    const unlock = () => this.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    this.track(() => window.removeEventListener('pointerdown', unlock));
    this.track(() => window.removeEventListener('keydown', unlock));
  }

  /** Create/resume the AudioContext. Safe to call repeatedly. */
  unlock(): void {
    if (!this.ctx.isBrowser) return;
    if (!this.context) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.context = new Ctor();
      this.master = this.context.createGain();
      this.master.gain.value = this._muted ? 0 : this._volume;
      this.master.connect(this.context.destination);
    }
    void this.context.resume();
    this.unlocked = true;
  }

  /** Register a sound from a URL. Returns false if audio is unavailable. */
  async register(
    id: string,
    url: string,
    options: { loop?: boolean; volume?: number } = {},
  ): Promise<boolean> {
    if (!this.context || !this.master) return false;
    if (this.sounds.has(id)) return true;

    const res = await fetch(url);
    const raw = await res.arrayBuffer();
    const buffer = await this.context.decodeAudioData(raw);

    const gain = this.context.createGain();
    gain.gain.value = options.volume ?? 1;
    gain.connect(this.master);

    this.sounds.set(id, {
      buffer,
      gain,
      loop: options.loop ?? false,
      baseVolume: options.volume ?? 1,
    });
    return true;
  }

  play(id: string, { fade = this.config.audio.crossfade }: { fade?: number } = {}): void {
    const ctx = this.context;
    const sound = this.sounds.get(id);
    if (!ctx || !sound) return;

    const source = ctx.createBufferSource();
    source.buffer = sound.buffer;
    source.loop = sound.loop;
    source.connect(sound.gain);

    sound.gain.gain.cancelScheduledValues(ctx.currentTime);
    sound.gain.gain.setValueAtTime(0, ctx.currentTime);
    sound.gain.gain.linearRampToValueAtTime(sound.baseVolume, ctx.currentTime + fade);

    source.start();
    sound.source = source;
  }

  stop(id: string, { fade = this.config.audio.crossfade }: { fade?: number } = {}): void {
    const ctx = this.context;
    const sound = this.sounds.get(id);
    if (!ctx || !sound?.source) return;

    sound.gain.gain.cancelScheduledValues(ctx.currentTime);
    sound.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + fade);
    sound.source.stop(ctx.currentTime + fade);
    sound.source = undefined;
  }

  setMuted(muted: boolean): void {
    this._muted = muted;
    if (this.master && this.context) {
      this.master.gain.linearRampToValueAtTime(
        muted ? 0 : this._volume,
        this.context.currentTime + 0.2,
      );
    }
    this.events.emit('audio:mute', { muted });
  }

  toggleMute(): void {
    this.setMuted(!this._muted);
  }

  setVolume(volume: number): void {
    this._volume = Math.max(0, Math.min(1, volume));
    if (this.master && this.context && !this._muted) {
      this.master.gain.linearRampToValueAtTime(this._volume, this.context.currentTime + 0.2);
    }
    this.events.emit('audio:volume', { volume: this._volume });
  }

  protected override onDispose(): void {
    for (const sound of this.sounds.values()) sound.source?.stop();
    this.sounds.clear();
    void this.context?.close();
    this.context = undefined;
    this.master = undefined;
  }
}
