import { ICON_GRID, ICON_STROKE, type CustomIconProps } from './types';

/** Signal Shard — the collectible mark. */
export function Shard({ size = 24, title, ...props }: CustomIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${ICON_GRID} ${ICON_GRID}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE}
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 2 4 9l3 11 5 2 5-2 3-11-8-7Z" />
      <path d="M12 2v20M4 9h16M7 20l5-9 5 9" opacity="0.5" />
    </svg>
  );
}
