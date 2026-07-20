import { Manager } from '../core/Manager';
import type { PointerType, Vec2 } from '@/types';

/**
 * Global pointer & interaction hub.
 *
 * Samples a single set of pointer listeners for the whole app (instead of
 * every component attaching its own), exposing both raw pixel coordinates and
 * normalised device coordinates (-1..1) for 3D raycasting. Hover state is
 * centralised so the cursor, audio and analytics can all react to one signal.
 */
export class InteractionManager extends Manager {
  readonly pointer: Vec2 = { x: 0, y: 0 };
  readonly normalized: Vec2 = { x: 0, y: 0 };
  private _type: PointerType = 'mouse';
  private _hovered: string | null = null;
  private lastMove = 0;

  get pointerType(): PointerType {
    return this._type;
  }

  get hovered(): string | null {
    return this._hovered;
  }

  override init(): void {
    if (!this.ctx.isBrowser) return;

    const onPointerMove = (e: PointerEvent) => {
      this._type = (e.pointerType as PointerType) || 'mouse';
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.normalized.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.normalized.y = -((e.clientY / window.innerHeight) * 2 - 1);

      // Throttle emission to the configured raycast cadence.
      const now = e.timeStamp;
      if (now - this.lastMove >= this.config.interaction.raycastThrottle) {
        this.lastMove = now;
        this.events.emit('pointer:move', {
          position: { ...this.pointer },
          normalized: { ...this.normalized },
          type: this._type,
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      this.events.emit('pointer:down', {
        position: { x: e.clientX, y: e.clientY },
        type: (e.pointerType as PointerType) || 'mouse',
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      this.events.emit('pointer:up', {
        position: { x: e.clientX, y: e.clientY },
        type: (e.pointerType as PointerType) || 'mouse',
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    this.track(() => window.removeEventListener('pointermove', onPointerMove));
    this.track(() => window.removeEventListener('pointerdown', onPointerDown));
    this.track(() => window.removeEventListener('pointerup', onPointerUp));
  }

  /** Update the globally-hovered interactive id (drives cursor variants etc.). */
  setHovered(id: string | null): void {
    if (id === this._hovered) return;
    this._hovered = id;
    this.events.emit('interaction:hover', { id });
  }

  /** Report a click on a registered interactive element. */
  click(id: string): void {
    this.events.emit('interaction:click', { id });
  }
}
