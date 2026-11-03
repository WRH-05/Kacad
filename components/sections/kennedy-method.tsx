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
  revealRadius: 160,
  softness: 0.6,
  linger: 0.8,
  wander: true
} as const;

export function KennedyMethod({ method }: KennedyMethodProps) {
  const items = Object.values(method.items);

  return (
    <section
      id="method"
      aria-labelledby="method-title"
      className="section-anchor relative overflow-hidden border-b border-line/40 bg-surface py-20 lg:py-28"
    >
      <div className="section-shell grid items-center gap-8 lg:grid-cols-[15rem_minmax(0,1fr)_15rem] xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
        <div
          className="relative hidden h-[24rem] w-60 shrink-0 justify-self-start lg:block xl:h-[28rem] xl:w-72"
          aria-hidden="true"
        >
          <DitherVeil
            src="/images/method/school-left.png"
            {...veilProps}
            className="h-full w-full"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center lg:col-start-2 lg:px-8 lg:text-left">
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
                    {item.number}
                  </span>
                  <span aria-hidden="true" className="font-mono text-[11px] text-accent/60">
                    ·
                  </span>
                  <h3 className="font-serif text-xl leading-snug text-ink sm:text-2xl">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:pl-10">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div
          className="relative hidden h-[24rem] w-60 shrink-0 justify-self-end lg:block xl:h-[28rem] xl:w-72"
          aria-hidden="true"
        >
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
