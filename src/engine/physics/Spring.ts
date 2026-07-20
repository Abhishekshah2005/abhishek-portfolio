export interface SpringConfig {
  /** Restoring force. Higher = snappier. */
  stiffness: number;
  /** Resistance. Higher = less overshoot. */
  damping: number;
  /** Inertia. Higher = heavier, slower. */
  mass: number;
  /** Settle threshold for value & velocity. */
  precision: number;
}

export const SPRING_PRESETS = {
  default: { stiffness: 170, damping: 26, mass: 1, precision: 0.001 },
  gentle: { stiffness: 120, damping: 20, mass: 1, precision: 0.001 },
  wobbly: { stiffness: 180, damping: 12, mass: 1, precision: 0.001 },
  stiff: { stiffness: 260, damping: 30, mass: 1, precision: 0.001 },
  slow: { stiffness: 80, damping: 26, mass: 1, precision: 0.001 },
  molasses: { stiffness: 40, damping: 30, mass: 1, precision: 0.001 },
} as const satisfies Record<string, SpringConfig>;

export type SpringPreset = keyof typeof SPRING_PRESETS;

/**
 * A framerate-independent 1D spring integrator.
 *
 * Uses semi-implicit Euler with sub-stepping so behaviour is identical at
 * 30fps or 144fps. The building block for magnetic buttons, cursor follow,
 * tilt and any organic motion in the engine.
 */
export class Spring {
  value: number;
  target: number;
  velocity = 0;
  private config: SpringConfig;

  constructor(initial = 0, config: SpringConfig = SPRING_PRESETS.default) {
    this.value = initial;
    this.target = initial;
    this.config = config;
  }

  setConfig(config: Partial<SpringConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /** Set a new target; the spring animates toward it. */
  setTarget(target: number): void {
    this.target = target;
  }

  /** Jump instantly to a value, killing velocity. */
  set(value: number): void {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  get isSettled(): boolean {
    return (
      Math.abs(this.velocity) < this.config.precision &&
      Math.abs(this.target - this.value) < this.config.precision
    );
  }

  /** Advance the simulation by `delta` seconds. Returns the new value. */
  update(delta: number): number {
    if (this.isSettled) {
      this.value = this.target;
      this.velocity = 0;
      return this.value;
    }

    const { stiffness, damping, mass } = this.config;
    // Sub-step for stability under large deltas.
    const steps = Math.max(1, Math.ceil(delta / (1 / 120)));
    const dt = delta / steps;

    for (let i = 0; i < steps; i++) {
      const force = -stiffness * (this.value - this.target);
      const drag = -damping * this.velocity;
      const acceleration = (force + drag) / mass;
      this.velocity += acceleration * dt;
      this.value += this.velocity * dt;
    }

    return this.value;
  }
}
