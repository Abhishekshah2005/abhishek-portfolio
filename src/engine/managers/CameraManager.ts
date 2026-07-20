import { Vector3, MathUtils } from 'three';
import { Manager, type EngineContext } from '../core/Manager';
import { TickPriority } from '@/types';

export interface CameraWaypoint {
  /** Normalised scroll progress at which this waypoint is reached (0-1). */
  at: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
}

/**
 * Framework-agnostic camera state.
 *
 * The manager holds the *desired* camera transform and eases the *current*
 * transform toward it every frame. A React/Three camera simply copies from
 * `position`, `target` and `fov` each frame — the manager never owns a Three
 * camera itself, which keeps it renderer-independent and testable.
 *
 * A waypoint track lets the scroll system drive a cinematic camera path by
 * sampling `applyProgress(progress)`.
 */
export class CameraManager extends Manager {
  readonly position = new Vector3();
  readonly target = new Vector3();
  fov: number;

  private readonly desiredPosition = new Vector3();
  private readonly desiredTarget = new Vector3();
  private desiredFov: number;

  private damping: number;
  private waypoints: CameraWaypoint[] = [];

  constructor(ctx: EngineContext) {
    super(ctx);
    const cam = ctx.config.camera;
    this.fov = cam.fov;
    this.desiredFov = cam.fov;
    this.damping = cam.damping;
    this.position.set(...cam.position);
    this.desiredPosition.set(...cam.position);
  }

  override init(): void {
    this.track(
      this.ticker.add((state) => this.update(state.delta), TickPriority.Camera),
    );
  }

  /** Set the camera's target transform; the rig eases toward it. */
  setTarget(position: [number, number, number], lookAt: [number, number, number]): void {
    this.desiredPosition.set(...position);
    this.desiredTarget.set(...lookAt);
  }

  setFov(fov: number): void {
    this.desiredFov = fov;
  }

  /** Snap instantly to a transform with no easing. */
  snapTo(position: [number, number, number], lookAt: [number, number, number]): void {
    this.desiredPosition.set(...position);
    this.desiredTarget.set(...lookAt);
    this.position.copy(this.desiredPosition);
    this.target.copy(this.desiredTarget);
  }

  setDamping(value: number): void {
    this.damping = value;
  }

  /** Define a cinematic camera path sampled by scroll progress. */
  setWaypoints(waypoints: CameraWaypoint[]): void {
    this.waypoints = [...waypoints].sort((a, b) => a.at - b.at);
  }

  /** Sample the waypoint track at a given progress and set it as the target. */
  applyProgress(progress: number): void {
    if (this.waypoints.length === 0) return;
    const p = MathUtils.clamp(progress, 0, 1);

    if (p <= this.waypoints[0].at) {
      this.applyWaypoint(this.waypoints[0]);
      return;
    }
    const last = this.waypoints[this.waypoints.length - 1];
    if (p >= last.at) {
      this.applyWaypoint(last);
      return;
    }

    for (let i = 0; i < this.waypoints.length - 1; i++) {
      const a = this.waypoints[i];
      const b = this.waypoints[i + 1];
      if (p >= a.at && p <= b.at) {
        const span = b.at - a.at || 1;
        const t = (p - a.at) / span;
        this.desiredPosition.set(
          MathUtils.lerp(a.position[0], b.position[0], t),
          MathUtils.lerp(a.position[1], b.position[1], t),
          MathUtils.lerp(a.position[2], b.position[2], t),
        );
        this.desiredTarget.set(
          MathUtils.lerp(a.lookAt[0], b.lookAt[0], t),
          MathUtils.lerp(a.lookAt[1], b.lookAt[1], t),
          MathUtils.lerp(a.lookAt[2], b.lookAt[2], t),
        );
        this.desiredFov = MathUtils.lerp(a.fov ?? this.fov, b.fov ?? this.fov, t);
        return;
      }
    }
  }

  private applyWaypoint(wp: CameraWaypoint): void {
    this.desiredPosition.set(...wp.position);
    this.desiredTarget.set(...wp.lookAt);
    if (wp.fov !== undefined) this.desiredFov = wp.fov;
  }

  private update(delta: number): void {
    // Frame-rate independent exponential smoothing.
    const alpha = 1 - Math.pow(this.damping, delta * 60);
    this.position.lerp(this.desiredPosition, alpha);
    this.target.lerp(this.desiredTarget, alpha);
    this.fov = MathUtils.lerp(this.fov, this.desiredFov, alpha);
  }
}
