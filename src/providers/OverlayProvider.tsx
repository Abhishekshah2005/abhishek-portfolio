'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { LucideIcon } from '@/icons';
import { useEngineOptional } from '@/hooks/useEngine';

export type ToastTone = 'neutral' | 'flux' | 'ember' | 'rare' | 'gold' | 'danger';

export interface ToastOptions {
  title?: string;
  description?: string;
  tone?: ToastTone;
  icon?: LucideIcon;
  /** Auto-dismiss after ms (0 = sticky). */
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: string;
}

interface OverlayContextValue {
  // Overlay stack (HUD, menus, terminal, dialogs mount here)
  open: (id: string) => void;
  close: (id: string) => void;
  isOpen: (id: string) => boolean;
  readonly openCount: number;
  readonly topmost: string | null;

  // Notifications / achievements
  toasts: ToastItem[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

/**
 * Reusable overlay architecture for the whole experience: a z-ordered overlay
 * stack (HUD, menus, notifications, achievements, tooltips, terminal, dialogs,
 * game overlays all mount through it) plus a toast queue. While any overlay is
 * open, smooth scroll is locked via the engine.
 */
export function OverlayProvider({ children }: { children: ReactNode }) {
  const engine = useEngineOptional();
  const [stack, setStack] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<string, number>());

  const open = useCallback((id: string) => {
    setStack((s) => (s.includes(id) ? s : [...s, id]));
  }, []);

  const close = useCallback((id: string) => {
    setStack((s) => s.filter((x) => x !== id));
  }, []);

  const isOpen = useCallback((id: string) => stack.includes(id), [stack]);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${counter.current++}`;
      const item: ToastItem = { id, tone: 'neutral', duration: 4000, ...options };
      setToasts((t) => [...t, item]);
      if (item.duration && item.duration > 0) {
        const timer = window.setTimeout(() => dismiss(id), item.duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  // Lock smooth scroll whenever something is open.
  useEffect(() => {
    if (!engine) return;
    if (stack.length > 0) engine.scroll.stop();
    else engine.scroll.start();
  }, [engine, stack.length]);

  // Clean up pending timers on unmount.
  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => window.clearTimeout(t));
  }, []);

  const value = useMemo<OverlayContextValue>(
    () => ({
      open,
      close,
      isOpen,
      openCount: stack.length,
      topmost: stack.at(-1) ?? null,
      toasts,
      toast,
      dismiss,
    }),
    [open, close, isOpen, stack, toasts, toast, dismiss],
  );

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlay(): OverlayContextValue {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within <OverlayProvider>.');
  return ctx;
}

/** Convenience: just the toast API. */
export function useToast() {
  const { toast, dismiss } = useOverlay();
  return { toast, dismiss };
}
