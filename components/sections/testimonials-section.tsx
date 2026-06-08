import { testimonials } from '@/content/testimonials';
import type { Dictionary } from '@/lib/dictionaries';

type TestimonialsSectionProps = {
  testimonialsDict: Dictionary['testimonials'];
};

export function TestimonialsSection({ testimonialsDict }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="section-anchor bg-sand/40 py-20 lg:py-28">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
            Kennedy School
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
            {testimonialsDict.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{testimonialsDict.intro}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {testimonials.map(({ id }) => {
            const item = testimonialsDict.items[id];
            return (
              <blockquote
                key={id}
                className="flex flex-col rounded-2xl border border-terracotta/15 bg-white p-6 shadow-card"
              >
                <p className="flex-1 text-base leading-relaxed text-slate-700">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-6 border-t border-sand pt-4">
                  <cite className="not-italic">
                    <span className="font-semibold text-navy">{item.name}</span>
                    <span className="text-slate-500">
                      {' '}
                      · {item.role} · {item.location}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            );
          })}
        </div>
      </div>
    </section>
  );
}
