import type { CourseTrack } from '@/content/courses';
import { cn } from '@/lib/utils';

const trackColor: Record<CourseTrack, string> = {
  tech: 'text-accent',
  arts: 'text-rubric',
  languages: 'text-highlight'
};

type TrackEmblemProps = {
  track: CourseTrack;
  className?: string;
};

/**
 * Static, single-colour version of the Kennedy asterisk used to mark a track.
 * The four bars mirror the reference mark (vertical, X, horizontal).
 */
export function TrackEmblem({ track, className }: TrackEmblemProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', trackColor[track], className)}
    >
      <g stroke="currentColor" strokeWidth="16" strokeLinecap="round">
        <line x1="100" y1="20" x2="100" y2="180" />
        <line x1="38" y1="38" x2="162" y2="162" />
        <line x1="162" y1="38" x2="38" y2="162" />
        <line x1="20" y1="100" x2="180" y2="100" />
      </g>
    </svg>
  );
}
