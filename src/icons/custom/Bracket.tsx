import { ICON_GRID, ICON_STROKE, type CustomIconProps } from './types';

export interface BracketProps extends CustomIconProps {
  /** Which corner the bracket frames. */
  corner?: 'tl' | 'tr' | 'bl' | 'br';
}

const ROTATION: Record<NonNullable<BracketProps['corner']>, number> = {
  tl: 0,
  tr: 90,
  br: 180,
  bl: 270,
};

/** HUD corner bracket — the focus-frame mark. */
export function Bracket({ size = 24, corner = 'tl', title, style, ...props }: BracketProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${ICON_GRID} ${ICON_GRID}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE}
      strokeLinecap="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      style={{ transform: `rotate(${ROTATION[corner]}deg)`, ...style }}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M4 10V4h6" />
    </svg>
  );
}
