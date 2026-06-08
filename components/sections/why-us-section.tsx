import type { Dictionary } from '@/lib/dictionaries';

type WhyUsSectionProps = {
  whyUs: Dictionary['whyUs'];
};

export function WhyUsSection({ whyUs }: WhyUsSectionProps) {
  return (
    <section id="why-us" className="section-anchor py-20 lg:py-28">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
              Kennedy School
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
              {whyUs.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{whyUs.intro}</p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {whyUs.items.map((item, index) => (
              <li
                key={item}
                className="rounded-2xl border border-navy/8 bg-white p-5 shadow-card transition hover:-translate-y-0.5"
              >
                <span className="font-display text-2xl font-semibold text-gold/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
