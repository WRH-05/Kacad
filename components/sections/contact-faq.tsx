'use client';

import * as Accordion from '@radix-ui/react-accordion';
import type { Dictionary } from '@/lib/dictionaries';

type ContactFaqProps = {
  items: Dictionary['contact']['faq']['items'];
};

export function ContactFaq({ items }: ContactFaqProps) {
  return (
    <Accordion.Root type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <Accordion.Item
          key={index}
          value={`faq-${index}`}
          className="border-b border-line/40 pb-4"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-4 text-left font-serif text-xl leading-snug text-ink transition hover:text-accent">
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="font-mono text-lg leading-none transition-transform duration-300 group-data-[state=open]:rotate-45"
              >
                +
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden text-sm leading-relaxed text-ink-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="max-w-3xl pb-4 pr-8">{item.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
