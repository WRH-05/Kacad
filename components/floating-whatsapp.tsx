'use client';

import { usePathname } from 'next/navigation';
import { whatsappHref } from '@/content/contact';
import { interpolate } from '@/lib/utils';

type FloatingWhatsAppProps = {
  programmes: { id: string; title: string }[];
  prefillTemplate: string;
  label: string;
  ariaLabel: string;
};

export function FloatingWhatsApp({
  programmes,
  prefillTemplate,
  label,
  ariaLabel
}: FloatingWhatsAppProps) {
  const pathname = usePathname();
  const match = pathname.match(/^\/(?:en|fr)\/courses\/([^/?#]+)/);
  const slug = match?.[1];
  const programme = slug ? programmes.find((entry) => entry.id === slug) : undefined;

  const href = whatsappHref(
    programme ? interpolate(prefillTemplate, { course: programme.title }) : undefined
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex items-center gap-2 border border-accent bg-accent px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-ink shadow-soft transition hover:bg-accent/90 md:hidden"
    >
      <span
        className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-highlight motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
