import { cn } from '@/lib';

export interface ProgressRingProps {
  /** Progress 0–1. */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** Show the percentage in the center (mono). */
  showLabel?: boolean;
  className?: string;
}

/**
 * Circular progress indicator — the reactor-charge gauge used by the loader and
 * HUD. Token-driven flux stroke, animated dash offset. `role="progressbar"` for
 * assistive tech.
 */
export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 4,
  showLabel = false,
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const pct = Math.round(clamped * 100);

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-flux)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset var(--dur-ui) var(--ease-signal)' }}
        />
      </svg>
      {showLabel && (
        <span className="absolute font-mono text-xs tabular-nums text-signal">{pct}%</span>
      )}
    </div>
  );
}
