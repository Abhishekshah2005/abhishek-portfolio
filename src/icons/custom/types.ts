import type { SVGProps } from 'react';

/**
 * Base props for hand-authored custom SVG icons.
 *
 * Custom marks (brackets, shard, reticle, wordmark) live as typed React SVG
 * components on a 24×24 grid with 1.5 stroke and `currentColor`, mirroring the
 * Lucide grammar so both sets read as one family. To add a designed SVG,
 * paste its markup into a new component in this folder following `Shard`.
 */
export interface CustomIconProps extends SVGProps<SVGSVGElement> {
  /** Pixel size for both width & height. */
  size?: number;
  /** Accessible label; omit for decorative icons. */
  title?: string;
}

export const ICON_GRID = 24;
export const ICON_STROKE = 1.5;
