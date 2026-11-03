import DitherVeil from '@/components/ui/dither-veil';
import type { Dictionary } from '@/lib/dictionaries';

type KennedyMethodProps = {
  method: Dictionary['method'];
};

const veilProps = {
  fit: 'contain',
  pattern: 'floyd',
  pixelSize: 2,
  levels: 2,
  inkColor: '#881035',
  paperColor: '#ffffff',
  contrast: 1.2,
  revealRadius: 200,
  softness: 0.6,
  linger: 0.8,
  wander: false
} as const;

export function KennedyMethod({ method }: KennedyMethodProps) {
  const items = Object.values(method.items);

  return (
    <section
      id="method"
      aria-labelledby="method-title"
      className="section-anchor relative flex min-h-[640px] w-full items-center justify-center overflow-hidden border-b border-line/40 bg-surface py-20 lg:min-h-[720px] lg:py-28"
    >
      {/* Left flank: pinned to the viewport edge, canvas aspect-matched so the
          sandals sit on the section floor instead of floating in a letterbox. */}
      <div
        className="pointer-events-auto absolute bottom-0 left-0 z-0 hidden h-[85%] max-h-[640px] w-[320px] lg:block xl:w-[400px]"
        aria-hidden="true"
      >
        <div className="absolute bottom-0 left-0 aspect-[445/539] w-full">
          <DitherVeil
            src="/images/method/school-left.png"
            {...veilProps}
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Center manifesto: width is capped against the flank widths so text can
          never run under either canvas at any viewport >= lg. */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 text-left lg:max-w-[min(42rem,calc(100%-42rem))] lg:px-4 xl:max-w-[min(42rem,calc(100%-52rem))] xl:px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          {method.eyebrow}
        </p>
        <h2
          id="method-title"
          className="mt-4 font-serif text-3xl font-light leading-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {method.title}
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">{method.intro}</p>

        <ol
          role="list"
          className="mt-10 divide-y divide-line/40 border-y border-line/40"
        >
          {items.map((item) => (
            <li key={item.number} className="py-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
                  {item.number} ·
                </span>
                <h3 className="font-serif text-xl leading-snug text-ink sm:text-2xl">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:pl-[calc(1.5rem+0.75rem)]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Right flank */}
      <div
        className="pointer-events-auto absolute bottom-0 right-0 z-0 hidden h-[85%] max-h-[640px] w-[320px] lg:block xl:w-[400px]"
        aria-hidden="true"
      >
        <div className="absolute bottom-0 right-0 aspect-[438/570] w-full">
          <DitherVeil
            src="/images/method/school-right.png"
            {...veilProps}
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
