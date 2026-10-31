'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type AsteriskLogoProps = {
  className?: string;
  title?: string;
  animated?: boolean;
  /** Play the one-time four-glyph docking animation (hero only). */
  dock?: boolean;
  decorative?: boolean;
};

type Glyph = {
  angle: number;
  from: { x: number; y: number };
};

// North, South, West, East — each glyph docks into the same centre.
const GLYPHS: readonly Glyph[] = [
  { angle: 0, from: { x: 0, y: -32 } },
  { angle: 180, from: { x: 0, y: 32 } },
  { angle: 270, from: { x: -32, y: 0 } },
  { angle: 90, from: { x: 32, y: 0 } }
];

const DOCK_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Four intersecting K strokes rotated a quarter-turn each. The four stems
 * become the cardinal points and the arms form the four diagonals — the
 * 8-point starburst from the brand mark.
 */
export function AsteriskLogo({
  className,
  title = 'Kennedy Academy',
  animated = false,
  dock = false,
  decorative = false
}: AsteriskLogoProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn(
        'origin-center overflow-visible text-accent',
        animated &&
          'transition-transform duration-700 ease-out hover:rotate-45 motion-reduce:transition-none',
        className
      )}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      {!decorative ? <title>{title}</title> : null}
      {GLYPHS.map(({ angle, from }) => (
        <motion.g
          key={angle}
          initial={dock ? { x: from.x, y: from.y, opacity: 0 } : false}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 1.4, ease: DOCK_EASE }
          }
        >
          <g transform={`rotate(${angle} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1="50"
              y1="50"
              x2="74"
              y2="26"
              className="text-highlight"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              x1="50"
              y1="50"
              x2="74"
              y2="74"
              className="text-highlight"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        </motion.g>
      ))}
    </svg>
  );
}
