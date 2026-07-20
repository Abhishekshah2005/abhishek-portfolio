import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export interface IconProps {
  /** Any Lucide icon component. */
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  /**
   * Accessible label. If omitted the icon is decorative (`aria-hidden`).
   * If provided, it is exposed to assistive tech via `role="img"`.
   */
  label?: string;
  strokeWidth?: number;
}

/**
 * Standardises every Lucide icon to the ATLAS grammar: consistent sizing,
 * 1.5px stroke, `currentColor`, and correct a11y semantics. Icons are always
 * consumed through this wrapper — never used raw — so the set stays uniform.
 */
export function Icon({ icon: LucideCmp, size = 'md', className, label, strokeWidth = 1.5 }: IconProps) {
  return (
    <LucideCmp
      size={SIZE_PX[size]}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', className)}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    />
  );
}
