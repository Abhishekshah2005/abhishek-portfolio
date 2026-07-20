'use client';

import { useEngineStore } from './useEngineStore';
import type { QualityTier, DeviceType } from '@/types';

export interface PerformanceReadout {
  fps: number;
  tier: QualityTier;
  device: DeviceType;
  memoryMB: number | null;
  droppedFrames: number;
}

/** Reactive performance readout sourced from the PerformanceManager via store. */
export function usePerformance(): PerformanceReadout {
  const fps = useEngineStore((s) => s.fps);
  const tier = useEngineStore((s) => s.tier);
  const device = useEngineStore((s) => s.device);
  const memoryMB = useEngineStore((s) => s.memoryMB);
  const droppedFrames = useEngineStore((s) => s.droppedFrames);
  return { fps, tier, device, memoryMB, droppedFrames };
}
