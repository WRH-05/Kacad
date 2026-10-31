'use client';

import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HubImage } from '@/components/ui/hub-image';
import type { HubSpace } from '@/content/hub';
import type { Dictionary } from '@/lib/dictionaries';
import { cn } from '@/lib/utils';

type CampusHubProps = {
  hub: Dictionary['hub'];
  spaces: readonly HubSpace[];
};

export function CampusHub({ hub, spaces }: CampusHubProps) {
  const [activeId, setActiveId] = useState(spaces[0].id);
  const reduceMotion = useReducedMotion();

  const activeSpace = spaces.find((space) => space.id === activeId) ?? spaces[0];
  const activeLabels = hub.spaces[activeSpace.id];

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const currentIndex = spaces.findIndex((space) => space.id === activeId);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % spaces.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + spaces.length) % spaces.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = spaces.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextId = spaces[nextIndex].id;
    setActiveId(nextId);
    requestAnimationFrame(() => {
      document.getElementById(`hub-tab-${nextId}`)?.focus();
    });
  }

  return (
    <section
      id="hub"
      className="section-anchor border-y border-line/60 bg-surface-sunken/50 py-20 lg:py-28"
    >
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {hub.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              {hub.title}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-muted lg:col-span-7 lg:col-start-6">
            {hub.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div
              role="tablist"
              aria-label={hub.title}
              onKeyDown={handleKeyDown}
              className="flex flex-col border-t border-line/70"
            >
              {spaces.map((space, index) => {
                const labels = hub.spaces[space.id];
                const selected = space.id === activeId;

                return (
                  <button
                    key={space.id}
                    id={`hub-tab-${space.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="hub-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(space.id)}
                    className={cn(
                      'grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 border-b border-line/70 py-5 text-left transition',
                      selected ? 'text-accent' : 'text-ink-muted hover:text-ink'
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em]">
                      0{index + 1}
                    </span>
                    <span className="font-serif text-xl leading-snug md:text-2xl">
                      {labels.name}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                      {labels.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="hub-panel"
            role="tabpanel"
            aria-labelledby={`hub-tab-${activeSpace.id}`}
            className="lg:col-span-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={activeSpace.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
              >
                <HubImage
                  space={activeSpace}
                  alt={activeLabels.alt}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className={
                    activeSpace.orientation === 'portrait'
                      ? 'aspect-[4/5]'
                      : 'aspect-[16/10]'
                  }
                />

                <figcaption className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <h3 className="font-serif text-3xl text-ink">{activeLabels.name}</h3>
                    <p className="mt-2 max-w-xl leading-relaxed text-ink-muted">
                      {activeLabels.blurb}
                    </p>
                  </div>
                  {activeSpace.credit.name ? (
                    <a
                      href={activeSpace.credit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted hover:text-accent"
                    >
                      Photo · {activeSpace.credit.name}
                    </a>
                  ) : null}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
