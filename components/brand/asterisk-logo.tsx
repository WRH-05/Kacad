import { cn } from '@/lib/utils';

type AsteriskLogoProps = {
  className?: string;
  title?: string;
  animated?: boolean;
  decorative?: boolean;
};

const rotations = [0, 90, 180, 270];

/**
 * Four intersecting K strokes rotated a quarter-turn each. The four stems
 * become the cardinal points and the arms form the four diagonals — the
 * 8-point starburst from the brand mark.
 */
export function AsteriskLogo({
  className,
  title = 'Kennedy Academy',
  animated = false,
  decorative = false
}: AsteriskLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn(
        'text-accent',
        animated && 'transition-transform duration-700 ease-out hover:rotate-45 motion-reduce:transition-none',
        className
      )}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      {!decorative ? <title>{title}</title> : null}
      {rotations.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
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
      ))}
    </svg>
  );
}
