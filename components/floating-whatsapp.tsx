'use client';

import { usePathname } from 'next/navigation';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { whatsappHref } from '@/content/contact';
import { interpolate } from '@/lib/utils';

type FloatingWhatsAppProps = {
  programmes: { id: string; title: string }[];
  coursePrefill: string;
  generalPrefill: string;
  label: string;
  ariaLabel: string;
};

export function FloatingWhatsApp({
  programmes,
  coursePrefill,
  generalPrefill,
  label,
  ariaLabel
}: FloatingWhatsAppProps) {
  const pathname = usePathname();
  const match = pathname.match(/^\/(?:en|fr)\/courses\/([^/?#]+)/);
  const slug = match?.[1];
  const programme = slug ? programmes.find((entry) => entry.id === slug) : undefined;

  const href = whatsappHref(
    programme ? interpolate(coursePrefill, { course: programme.title }) : generalPrefill
  );

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-50 hidden items-center gap-3 border border-ink bg-ink px-4 py-3 text-surface shadow-soft transition hover:bg-ink/90 md:inline-flex"
      >
        <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25D366]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]">{label}</span>
        <span className="text-xs" aria-hidden="true">
          ↗
        </span>
      </a>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-50 inline-flex h-14 w-14 items-center justify-center border border-ink bg-ink text-surface shadow-soft transition hover:bg-ink/90 md:hidden"
      >
        <WhatsAppIcon className="h-7 w-7 text-[#25D366]" />
      </a>
    </>
  );
}
