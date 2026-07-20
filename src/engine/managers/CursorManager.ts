import { Manager, type EngineContext } from '../core/Manager';
import { TickPriority } from '@/types';
import type { InteractionManager } from './InteractionManager';

export type CursorVariant =
  | 'default'
  | 'hover'
  | 'button'
  | 'text'
  | 'drag'
  | 'magnetic'
  | 'loading'
  | 'disabled'
  | 'interactive'
  | 'view'
  | 'hidden';

/** Variants that expand the cursor to the hover radius. */
const EXPANDED: ReadonlySet<CursorVariant> = new Set<CursorVariant>([
  'hover',
  'button',
  'view',
  'interactive',
  'magnetic',
]);

export interface CursorState {
  /** Eased screen-space position of the custom cursor. */
  x: number;
  y: number;
  /** Current visual variant. */
  variant: CursorVariant;
  /** Target radius the renderer should tween toward. */
  radius: number;
  visible: boolean;
  /** Whether the pointer is currently pressed (drives click scale). */
  pressed: boolean;
  /** Smoothed pointer speed in px/frame (drives squash/stretch + glow). */
  speed: number;
  /** Direction of travel in radians (for velocity-aligned stretch). */
  angle: number;
  /** Optional label shown inside/next to the cursor (e.g. "VIEW", "DRAG"). */
  label: string | null;
}

/**
 * Drives the custom cursor.
 *
 * Reads the raw pointer from the {@link InteractionManager} and eases the
 * cursor toward it on the shared ticker, deriving velocity/direction so the
 * renderer can squash-and-stretch and glow with motion. All maths lives here
 * (never in React) so the cursor never re-renders per frame — the renderer
 * reads `state` via refs.
 */
export class CursorManager extends Manager {
  readonly state: CursorState;
  private prevX = 0;
  private prevY = 0;

  constructor(
    ctx: EngineContext,
    private readonly interaction: InteractionManager,
  ) {
    super(ctx);
    this.state = {
      x: 0,
      y: 0,
      variant: 'default',
      radius: ctx.config.cursor.radius,
      visible: false,
      pressed: false,
      speed: 0,
      angle: 0,
      label: null,
    };
  }

  override init(): void {
    if (!this.ctx.isBrowser) return;

    this.track(
      this.events.on('pointer:move', () => {
        if (!this.state.visible) this.state.visible = true;
      }),
    );
    this.track(this.events.on('pointer:down', () => (this.state.pressed = true)));
    this.track(this.events.on('pointer:up', () => (this.state.pressed = false)));

    const onLeave = () => (this.state.visible = false);
    const onEnter = () => (this.state.visible = true);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    this.track(() => document.removeEventListener('mouseleave', onLeave));
    this.track(() => document.removeEventListener('mouseenter', onEnter));

    this.track(this.ticker.add((s) => this.update(s.delta), TickPriority.PostRender));
  }

  setVariant(variant: CursorVariant, label: string | null = null): void {
    this.state.variant = variant;
    this.state.label = label;
    this.state.radius = EXPANDED.has(variant)
      ? this.config.cursor.hoverRadius
      : variant === 'text'
        ? this.config.cursor.radius * 0.5
        : this.config.cursor.radius;
    if (variant === 'hidden') this.state.visible = false;
  }

  reset(): void {
    this.setVariant('default');
  }

  private update(delta: number): void {
    const alpha = 1 - Math.pow(1 - this.config.cursor.lerp, delta * 60);
    this.state.x += (this.interaction.pointer.x - this.state.x) * alpha;
    this.state.y += (this.interaction.pointer.y - this.state.y) * alpha;

    const dx = this.state.x - this.prevX;
    const dy = this.state.y - this.prevY;
    const instantSpeed = Math.hypot(dx, dy);
    // Smooth the speed so stretch/glow don't jitter.
    this.state.speed += (instantSpeed - this.state.speed) * 0.2;
    if (instantSpeed > 0.5) this.state.angle = Math.atan2(dy, dx);
    this.prevX = this.state.x;
    this.prevY = this.state.y;
  }
}
