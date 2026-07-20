import { cn } from '@/lib';

/**
 * Keyboard skip-to-content link — visually hidden until focused. First tab stop
 * so keyboard users bypass the immersive layers and jump straight to content.
 */
export function SkipLink({ href = '#main-content', className }: { href?: string; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only rounded-md bg-graphite px-4 py-2 text-sm font-medium text-signal shadow-elev-3',
        'focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-toast)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
        className,
      )}
    >
      Skip to content
    </a>
  );
}
