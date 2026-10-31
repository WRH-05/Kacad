import type { Dictionary } from '@/lib/dictionaries';

type KennedyMethodProps = {
  method: Dictionary['method'];
};

export function KennedyMethod({ method }: KennedyMethodProps) {
  const items = Object.values(method.items);

  return (
    <section id="method" className="section-anchor py-20 lg:py-28">
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
    </section>
  );
}
