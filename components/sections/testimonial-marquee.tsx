'use client';

import { useState } from 'react';
import { testimonials } from '@/content/testimonials';
import type { Dictionary } from '@/lib/dictionaries';

type TestimonialMarqueeProps = {
  testimonialsDict: Dictionary['testimonials'];
};

export function TestimonialMarquee({ testimonialsDict }: TestimonialMarqueeProps) {
  const [paused, setPaused] = useState(false);

  const items = testimonials.map((testimonial) => ({
    id: testimonial.id,
    ...testimonialsDict.items[testimonial.id]
  }));

  function renderGroup(clone: boolean) {
    return (
      <div className="flex" aria-hidden={clone || undefined}>
        {items.map((item) => (
          <figure
            key={`${item.id}-${clone ? 'clone' : 'main'}`}
            className="w-[84vw] max-w-[30rem] shrink-0 border-l border-line/70 px-6 py-2 sm:px-8"
          >
            <blockquote className="font-serif text-xl italic leading-relaxed text-ink sm:text-2xl">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
              {item.name} · {item.role} · {item.location}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <section
      id="voices"
      className="section-anchor border-y border-line/60 bg-surface-sunken/40 py-20 lg:py-28"
    >
      <div className="section-shell">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {testimonialsDict.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              {testimonialsDict.title}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">{testimonialsDict.intro}</p>
          </div>

          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className="self-start border border-line/80 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted transition hover:border-accent hover:text-accent motion-reduce:hidden sm:self-auto"
          >
            {paused ? testimonialsDict.play : testimonialsDict.pause}
          </button>
        </div>
      </div>

      <div className="marquee mt-12" data-paused={paused}>
        <div className="marquee-track">
          {renderGroup(false)}
          {renderGroup(true)}
        </div>
      </div>
    </section>
  );
}
