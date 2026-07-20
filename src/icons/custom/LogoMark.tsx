import { type CustomIconProps } from './types';

/**
 * ATLAS logo mark — an abstract "A" formed as a descending core within a frame.
 * Placeholder identity mark; refine once brand art is finalised.
 */
export function LogoMark({ size = 24, title, ...props }: CustomIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 3 5 21M12 3l7 18M8 14h8" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
