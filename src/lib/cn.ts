import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Class name composer: `clsx` for conditional joining + `tailwind-merge` to
 * resolve conflicting Tailwind utilities (last one wins). The single class
 * helper for the entire design system.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
