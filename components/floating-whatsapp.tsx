'use client';

import { useEffect, useState } from 'react';
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

const REVEAL_AFTER_PX = 300;

export function FloatingWhatsApp({
  programmes,
  coursePrefill,
  generalPrefill,
  label,
  ariaLabel
}: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const match = pathname.match(/^\/(?:en|fr)\/courses\/([^/?#]+)/);
  const slug = match?.[1];
  const programme = slug ? programmes.find((entry) => entry.id === slug) : undefined;

  const href = whatsappHref(
    programme ? interpolate(coursePrefill, { course: programme.title }) : generalPrefill
  );

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      frame = 0;
      setVisible(window.scrollY > REVEAL_AFTER_PX);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      title={label}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center border border-ink bg-ink text-surface shadow-soft transition hover:bg-ink/90 md:hidden"
    >
      <WhatsAppIcon className="h-7 w-7 text-[#25D366]" />
    </a>
  );
}
