import DitherVeil from '@/components/ui/dither-veil';
import type { Dictionary } from '@/lib/dictionaries';

type KennedyMethodProps = {
  method: Dictionary['method'];
};

export function KennedyMethod({ method }: KennedyMethodProps) {
  const items = Object.values(method.items);

  return (
    <section id="method" className="section-anchor relative overflow-hidden py-20 lg:py-28">
      <div
        className="absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-[32rem] max-h-full aspect-[854/579] shrink-0 sm:h-[36rem] lg:h-full">
          <DitherVeil
            src="/images/hero/school-of-athens.png"
            fit="contain"
            pattern="floyd"
            palette="duotone"
            pixelSize={2}
            levels={2}
            inkColor="#881035"
            paperColor="#ffffff"
            contrast={1.2}
            brightness={0}
            revealRadius={200}
            softness={0.6}
            linger={0.8}
            rim={0}
            wander
            className="h-full w-full"
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-surface/45 lg:bg-surface/0 lg:bg-gradient-to-r lg:from-surface/90 lg:via-surface/20 lg:to-surface/90"
        aria-hidden="true"
      />

      <div className="relative z-10 pointer-events-none">
        <div className="section-shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {method.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              {method.title}
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-ink-muted">{method.intro}</p>
          </div>

          <ol className="border-t border-line/70 lg:col-span-7 lg:col-start-6">
            {items.map((item) => (
              <li
                key={item.number}
                className="grid gap-4 border-b border-line/70 py-8 sm:grid-cols-[5rem_1fr] sm:gap-6"
              >
                <span className="font-serif text-4xl leading-none text-accent/70">
                  {item.number}
                </span>
                <div>
                  <h3 className="font-serif text-2xl leading-snug text-ink">{item.title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
