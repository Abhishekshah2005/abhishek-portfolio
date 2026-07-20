import type { Cleanup } from '@/types';

type Listener<T> = (payload: T) => void;

/**
 * A tiny, fully-typed event emitter.
 *
 * Generic over an event map so `emit`/`on` are checked against the exact
 * payload type for each key. This is the backbone of inter-manager
 * communication and deliberately has zero dependencies.
 */
export class EventEmitter<EventMap extends object> {
  private readonly listeners = new Map<keyof EventMap, Set<Listener<unknown>>>();

  /** Subscribe to an event. Returns an unsubscribe function. */
  on<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): Cleanup {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener as Listener<unknown>);
    return () => this.off(event, listener);
  }

  /** Subscribe to an event exactly once. */
  once<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): Cleanup {
    const wrapped: Listener<EventMap[K]> = (payload) => {
      this.off(event, wrapped);
      listener(payload);
    };
    return this.on(event, wrapped);
  }

  /** Remove a specific listener for an event. */
  off<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(listener as Listener<unknown>);
    if (set.size === 0) this.listeners.delete(event);
  }

  /** Emit an event to all subscribers. */
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    // Iterate a copy so listeners can safely unsubscribe during dispatch.
    for (const listener of [...set]) {
      (listener as Listener<EventMap[K]>)(payload);
    }
  }

  /** Number of listeners for an event (useful for tests / diagnostics). */
  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  /** Remove every listener, optionally scoped to a single event. */
  clear<K extends keyof EventMap>(event?: K): void {
    if (event) this.listeners.delete(event);
    else this.listeners.clear();
  }
}
