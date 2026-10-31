import Dither from '@/components/ui/dither';
import { cn } from '@/lib/utils';

type DitherBackgroundProps = {
  className?: string;
};

/**
 * Hero-only Dither field. The Dither component is a client island; this
 * wrapper stays a server component and supplies the exact exhibition config.
 */
export function DitherBackground({ className }: DitherBackgroundProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden bg-white',
        className
      )}
      aria-hidden="true"
    >
      <Dither
        waveColor="#5064c3"
        backgroundColor="#ffffff"
        ditherMode="bayer"
        pixelSize={2}
        colorNum={4}
        scale={1}
        waveSpeed={0.015}
        waveFrequency={3}
        waveAmplitude={0.3}
        contrast={1}
        brightness={0}
        enableMouseInteraction={false}
        clickRipple={false}
        intro={false}
        disableAnimation={false}
      />
    </div>
  );
}
